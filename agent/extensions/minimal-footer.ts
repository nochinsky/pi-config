import { homedir } from "node:os";
import { isAbsolute, relative, sep } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { stripTerminalSequences, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

// Display-only customization. Usage accounting and the standard editor stay intact.
function singleLine(value: string): string {
	return stripTerminalSequences(value).replace(/[\x00-\x1f\x7f-\x9f]/g, " ");
}

function displayPath(cwd: string): string {
	const fromHome = relative(homedir(), cwd);
	const insideHome = !isAbsolute(fromHome) && fromHome !== ".." && !fromHome.startsWith(`..${sep}`);
	return singleLine(insideHome ? (fromHome ? `~${sep}${fromHome}` : "~") : cwd);
}

export default function minimalFooter(pi: ExtensionAPI) {
	let enabled = true;

	function apply(ctx: ExtensionContext) {
		if (ctx.mode !== "tui") return;
		if (!enabled) {
			ctx.ui.setFooter(undefined);
			return;
		}

		ctx.ui.setFooter((tui, theme, footerData) => {
			const unsubscribe = footerData.onBranchChange(() => tui.requestRender());
			return {
				dispose: unsubscribe,
				invalidate() {},
				render(width: number): string[] {
					if (width <= 0) return [];
					const inset = width >= 40 ? " " : "";
					const available = width - inset.length * 2;
					const frame = (text: string) => theme.bg("toolSuccessBg",
						inset + text + " ".repeat(Math.max(0, available - visibleWidth(text))) + inset);
					const separator = theme.fg("dim", "  ·  ");
					const branch = footerData.getGitBranch();
					const left = theme.fg("muted", displayPath(ctx.cwd)) +
						(branch ? separator + theme.fg("accent", singleLine(branch)) : "");
					const model = ctx.model;
					const modelText = theme.fg("text", singleLine(model?.id ?? "no model")) +
						(model?.reasoning ? theme.fg("dim", ` · ${singleLine(pi.getThinkingLevel())}`) : "");
					const percent = ctx.getContextUsage()?.percent;
					const known = typeof percent === "number" && Number.isFinite(percent);
					const contextColor = known && percent >= 90 ? "error" :
						known && percent >= 70 ? "warning" : "accent";
					const contextText = known ? `ctx ${Math.round(percent)}%` : "ctx ?";
					let context = theme.fg(contextColor, contextText);
					// A five-cell meter only appears when the terminal has room for it.
					if (known && available >= 100) {
						const filled = Math.min(5, Math.max(0, Math.round(percent / 20)));
						context = theme.fg("dim", "ctx ") + theme.fg(contextColor, "━".repeat(filled)) +
							theme.fg("dim", "─".repeat(5 - filled)) + theme.fg(contextColor, ` ${Math.round(percent)}%`);
					}
					// On narrow terminals prioritize context, then model, then location.
					if (available <= visibleWidth(context)) return [frame(truncateToWidth(context, available))];
					const modelBudget = available - visibleWidth(context) - visibleWidth(separator);
					const fittedModel = modelBudget > 0 ? truncateToWidth(modelText, modelBudget) : "";
					const right = (fittedModel ? fittedModel + separator : "") + context;
					const leftBudget = available - visibleWidth(right) - 3;
					if (leftBudget < 1) return [frame(right)];
					const fittedLeft = truncateToWidth(left, leftBudget);
					const gap = " ".repeat(available - visibleWidth(fittedLeft) - visibleWidth(right));
					return [frame(fittedLeft + gap + right)];
				},
			};
		});
	}

	pi.on("session_start", (_event, ctx) => apply(ctx));
	pi.registerCommand("minimal-footer", {
		description: "Toggle the minimal footer, or use /minimal-footer on|off",
		handler: async (args, ctx) => {
			const option = args.trim().toLowerCase();
			if (option && option !== "on" && option !== "off") {
				ctx.ui.notify("Usage: /minimal-footer [on|off]", "info");
				return;
			}
			enabled = option ? option === "on" : !enabled;
			apply(ctx);
		},
	});
}
