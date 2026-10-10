import { homedir } from "node:os";
import { isAbsolute, relative, sep } from "node:path";
import type { ExtensionAPI, ToolRenderers } from "@earendil-works/pi-coding-agent";
import { Text, stripTerminalSequences, truncateToWidth, visibleWidth, type Component } from "@earendil-works/pi-tui";

// Presentation only: no tool replacements, editor changes, indexing, or dependencies.
const statusKey = Symbol("compact-tools-status");
type Status = { text: string; mark: string; color: "success" | "warning" | "error"; added?: number; removed?: number };
function singleLine(value: unknown): string {
	return stripTerminalSequences(typeof value === "string" ? value : "")
		.replace(/[\x00-\x1f\x7f-\x9f]/g, " ");
}

function displayPath(value: unknown, cwd: string): string {
	if (typeof value !== "string" || !value) return "...";
	if (!isAbsolute(value)) return singleLine(value);
	for (const [base, prefix] of [[cwd, ""], [homedir(), `~${sep}`]]) {
		const path = relative(base, value);
		if (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`)) {
			return singleLine(prefix + (path || "."));
		}
	}
	return singleLine(value);
}

// Clip headers instead of wrapping a long command over many terminal rows.
function row(text: (width: number) => string, outputPad: number, paint: (text: string) => string): Component {
	return {
		invalidate() {},
		render(width) {
			if (width < 1) return [];
			const pad = Math.min(Math.max(0, outputPad), Math.floor((width - 1) / 2));
			const content = truncateToWidth(text(width - pad * 2), width - pad * 2);
			return [paint(" ".repeat(pad) + content + " ".repeat(pad))];
		},
	};
}

function padded(component: Component, outputPad: number): Component {
	return {
		invalidate: () => component.invalidate(),
		render(width) {
			if (width < 1) return [];
			const pad = Math.min(Math.max(0, outputPad), Math.floor((width - 1) / 2));
			return component.render(width - pad * 2).map(line => " ".repeat(pad) + line);
		},
	};
}

export default function compactTools(pi: ExtensionAPI) {
	pi.registerToolRenderer((name, next) => {
		const native = next();
		if (!["read", "bash", "edit", "write"].includes(name)) return native;
		const renderers: ToolRenderers = {
			renderShell: "self",
			renderCall(args, theme, context) {
				// Written content lives in the native call renderer, not the result.
				if (name === "write" && context.expanded && native?.renderCall) {
					return padded(native.renderCall(args, theme, { ...context, lastComponent: undefined }), context.outputPad);
				}
				const label = (name[0].toUpperCase() + name.slice(1)).padEnd(5);
				let detail = name === "bash" ? singleLine(args?.command) || "..." : displayPath(args?.path, context.cwd);
				if (name === "read" && (args?.offset != null || args?.limit != null)) {
					const start = args.offset ?? 1;
					detail += `:${start}${args.limit != null ? `-${start + args.limit - 1}` : ""}`;
				}
				const prefix = theme.fg("dim", context.expanded ? "⌄ " : "› ")
					+ theme.fg(context.isError ? "error" : "accent", theme.bold(label)) + "  ";
				const detailColor = name === "bash" ? "muted" : "text";
				if (context.expanded) return padded(new Text(prefix + theme.fg(detailColor, detail), 0, 0), context.outputPad);
				// The result renderer updates shared state before these lines are painted.
				return row(width => {
					const status = context.state[statusKey] as Status | undefined;
					const stats = status?.added !== undefined
						? theme.fg("success", ` +${status.added}`) + theme.fg("error", ` −${status.removed}`)
						: status ? theme.fg(status.color === "success" ? "dim" : status.color, ` ${status.text}`) : "";
					const suffix = status ? theme.fg("dim", "  ·  ") + theme.fg(status.color, status.mark) + stats : "";
					const budget = Math.max(0, Math.min(96, width - visibleWidth(prefix) - visibleWidth(suffix)));
					return prefix + theme.fg(detailColor, budget ? truncateToWidth(detail, budget) : "") + suffix;
				}, context.outputPad, text => theme.bg(context.isError ? "toolErrorBg"
					: context.isPartial ? "toolPendingBg" : "toolSuccessBg", text));
			},
			renderResult(result, options, theme, context) {
				const output = result.content.filter(block => block.type === "text").map(block => block.text).join("\n");
				const hasImage = result.content.some(block => block.type === "image");
				const truncation = (result.details as { truncation?: { truncated?: boolean; outputLines?: number } } | undefined)?.truncation;
				// Don't count Pi's read-continuation notice as file content.
				const content = name === "read" ? output.replace(/\n\n\[\d+ more lines in file\. Use offset=\d+ to continue\.\]$/, "") : output;
				const count = truncation?.outputLines ?? (content ? content.replace(/\n$/, "").split("\n").length : 0);
				const status: Status = context.isError ? { text: "failed", mark: "×", color: "error" }
					: options.isPartial ? { text: `${name === "read" ? "reading" : name === "edit" ? "editing" : name === "write" ? "writing" : "running"}`, mark: "…", color: "warning" }
					: { text: hasImage ? "image" : `${count} ${count === 1 ? "line" : "lines"}`, mark: "✓", color: "success" };
				if (!context.isError && !options.isPartial && name === "edit") {
					const diff = (result.details as { diff?: string } | undefined)?.diff;
					status.text = "edited";
					if (typeof diff === "string") {
						const lines = diff.split("\n");
						status.added = lines.filter(line => line.startsWith("+") && !line.startsWith("+++")).length;
						status.removed = lines.filter(line => line.startsWith("-") && !line.startsWith("---")).length;
					}
				}
				if (!context.isError && !options.isPartial && name === "write") status.text = "written";
				if (truncation?.truncated) {
					status.text += " · truncated";
					if (!context.isError) { status.mark = "!"; status.color = "warning"; }
				}
				context.state[statusKey] = status;
				// Keep native expanded output, error diagnostics, truncation notices, and image handling.
				if (options.expanded || context.isError || hasImage) {
					const body = native?.renderResult?.(result, options, theme, { ...context, lastComponent: undefined })
						?? new Text(theme.fg("toolOutput", stripTerminalSequences(output)), 0, 0);
					return padded(body, context.outputPad);
				}
				return { invalidate() {}, render: () => [] };
			},
		};
		return renderers;
	});
}
