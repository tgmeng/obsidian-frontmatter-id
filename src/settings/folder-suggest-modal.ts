import { App, FuzzySuggestModal, TAbstractFile, TFolder } from "obsidian";

export class FolderSuggestModal extends FuzzySuggestModal<TFolder> {
	private handleConfirm: (folder: TFolder) => void;

	constructor(app: App) {
		super(app);
	}

	getItems(): TFolder[] {
		return this.app.vault
			.getAllLoadedFiles()
			.filter((folder: TAbstractFile) => folder instanceof TFolder);
	}

	getItemText(folder: TFolder): string {
		return folder.path;
	}

	onChooseItem(folder: TFolder, evt: MouseEvent | KeyboardEvent) {
		this.handleConfirm?.(folder);
	}

	onConfirm(cb: (folder: TFolder) => void) {
		this.handleConfirm = cb;
		return this;
	}
}
