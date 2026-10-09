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

				const branch = footerData.getGitBranch();
				const left = displayPath(ctx.cwd) + (branch ? ` · ${singleLine(branch)}` : "");
				const model = ctx.model;
				const modelText = singleLine(model?.id ?? "no model") +
					(model?.reasoning ? ` · ${pi.getThinkingLevel()}` : "");
				const percent = ctx.getContextUsage()?.percent;
				const known = typeof percent === "number" && Number.isFinite(percent);
				const contextText = known ? `ctx ${Math.round(percent)}%` : "ctx ?";
				const contextColor = known && percent >= 90 ? "error" :
					known && percent >= 70 ? "warning" : "muted";

				// On narrow terminals prioritize context, then model, then location.
				if (width <= visibleWidth(contextText)) {
					return [theme.fg(contextColor, truncateToWidth(contextText, width))];
				}
				const separator = " · ";
				const modelBudget = width - visibleWidth(contextText) - visibleWidth(separator);
				const fittedModel = modelBudget > 0 ? truncateToWidth(modelText, modelBudget) : "";
				const right = (fittedModel ? theme.fg("muted", fittedModel + separator) : "") +
					theme.fg(contextColor, contextText);
				const leftBudget = width - visibleWidth(right) - 3;
				if (leftBudget < 1) return [right];

				const fittedLeft = theme.fg("dim", truncateToWidth(left, leftBudget));
				const gap = " ".repeat(width - visibleWidth(fittedLeft) - visibleWidth(right));
				return [fittedLeft + gap + right];
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
