import { homedir } from "node:os";
import { isAbsolute, relative, sep } from "node:path";
import { VERSION, keyText, type ExtensionAPI, type ExtensionContext } from "@earendil-works/pi-coding-agent";
import { stripTerminalSequences, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

function singleLine(value: string): string {
	return stripTerminalSequences(value).replace(/[\x00-\x1f\x7f-\x9f]/g, " ");
}

function displayPath(cwd: string): string {
	const path = relative(homedir(), cwd);
	const insideHome = !isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`);
	return singleLine(insideHome ? (path ? `~${sep}${path}` : "~") : cwd);
}

export default function startupCard(pi: ExtensionAPI) {
	function apply(ctx: ExtensionContext, visible: boolean) {
		if (ctx.mode !== "tui") return;
		ctx.ui.setHeader((_tui, theme) => ({
			invalidate() {},
			render(width: number): string[] {
				if (!visible || width <= 0) return [];
				const size = Math.min(70, width);
				const project = displayPath(ctx.cwd);
				if (size < 20) return [truncateToWidth(theme.fg("accent", "Pi") + " · " + project, size)];
				const heading = theme.fg("accent", theme.bold("Pi")) + theme.fg("dim", ` · ${VERSION}`);
				const border = (text: string) => theme.fg("border", text);
				const model = singleLine(ctx.model?.id ?? "no model") +
					(ctx.model?.reasoning ? ` · ${singleLine(pi.getThinkingLevel())}` : "");
				const row = (text: string) => {
					const fitted = truncateToWidth(text, size - 4);
					return border("│ ") + fitted + " ".repeat(size - 4 - visibleWidth(fitted)) + border(" │");
				};
				const lines = [
					border("╭─ ") + heading + border(" " + "─".repeat(size - visibleWidth(heading) - 5) + "╮"),
					row(theme.fg("text", project)),
					row(theme.fg("muted", model)),
				];
				if (size >= 36) lines.push(row(theme.fg("dim", `/ commands  ·  ${keyText("app.tools.expand")} tools`)));
				lines.push(border("╰" + "─".repeat(size - 2) + "╯"));
				return lines.map(line => theme.bg("toolSuccessBg", line));
			},
		}));
	}

	pi.on("session_start", (event, ctx) => {
		if (ctx.mode !== "tui") return;
		const hasConversation = ctx.sessionManager.getBranch().some(entry => entry.type === "message");
		apply(ctx, event.reason !== "resume" && event.reason !== "fork" && !hasConversation);
	});
	pi.registerCommand("startup-card", {
		description: "Preview the startup card, or use /startup-card hide",
		handler: async (args, ctx) => {
			const option = args.trim().toLowerCase();
			if (option && option !== "show" && option !== "hide") {
				ctx.ui.notify("Usage: /startup-card [show|hide]", "info");
				return;
			}
			apply(ctx, option !== "hide");
		},
	});
}
