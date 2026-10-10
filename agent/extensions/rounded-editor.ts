import { CustomEditor, type ExtensionAPI, type KeybindingsManager } from "@earendil-works/pi-coding-agent";
import { sliceByColumn, visibleWidth, type EditorTheme, type TUI } from "@earendil-works/pi-tui";

// Draw inside native padding, so cursor, mouse, wrapping, and autocomplete geometry stay native.
class RoundedEditor extends CustomEditor {
	private bottomBorder = "";

	constructor(tui: TUI, theme: EditorTheme, keybindings: KeybindingsManager) {
		super(tui, theme, keybindings, { paddingX: 2, embedWorkingStatus: true });
	}

	setPaddingX(padding: number): void {
		// Pi copies its normal padding setting into custom editors on installation.
		super.setPaddingX(Math.max(2, padding));
	}

	protected renderTopBorder(width: number, hiddenLineCount: number): string {
		if (width < 6) return super.renderTopBorder(width, hiddenLineCount);
		return this.borderColor("╭") + super.renderTopBorder(width - 2, hiddenLineCount) + this.borderColor("╮");
	}

	protected renderBottomBorder(width: number, hiddenLineCount: number): string {
		this.bottomBorder = width < 6 ? super.renderBottomBorder(width, hiddenLineCount)
			: this.borderColor("╰") + super.renderBottomBorder(width - 2, hiddenLineCount) + this.borderColor("╯");
		return this.bottomBorder;
	}

	render(width: number): string[] {
		if (width <= 0) return [];
		const lines = super.render(width);
		if (width < 6) return lines;
		const bottom = lines.indexOf(this.bottomBorder, 1);
		return lines.map((line, index) => {
			// Leave the borders and the native autocomplete menu untouched.
			if (index === 0 || bottom < 0 || index >= bottom) return line;
			const content = sliceByColumn(line, 1, width - 2, true);
			const padding = " ".repeat(Math.max(0, width - 2 - visibleWidth(content)));
			return this.borderColor("│") + content + padding + "\x1b[0m" + this.borderColor("│");
		});
	}
}

export default function roundedEditor(pi: ExtensionAPI) {
	pi.on("session_start", (event, ctx) => {
		if (ctx.mode !== "tui") return;
		ctx.ui.setEditorComponent((tui, theme, keybindings) => {
			const editor = new RoundedEditor(tui, theme, keybindings);
			// Initial/resumed sessions populate history natively; /reload does not.
			if (event.reason === "reload") {
				for (const entry of ctx.sessionManager.buildContextEntries()) {
					if (entry.type !== "message" || entry.message.role !== "user") continue;
					const content = entry.message.content;
					editor.addToHistory(typeof content === "string" ? content
						: content.filter(block => block.type === "text").map(block => block.text).join(""));
				}
			}
			return editor;
		});
	});
}
