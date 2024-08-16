import { MarkdownView, Plugin, TFile } from "obsidian";
import * as uuid from "uuid";
import { DefaultSettings, FrontmatterIdSettings, SettingTab } from "./settings";

export default class FrontmatterIdPlugin extends Plugin {
	settings: FrontmatterIdSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: "generate-frontmatter-id",
			name: "Generate Frontmatter Id",
			checkCallback: (checking: boolean) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView && markdownView.file) {
					if (!checking) {
						this.updateFrontmatterId(markdownView.file, {
							shouldExclude: false,
						});
					}
					return true;
				}
			},
		});

		this.registerEvent(
			this.app.vault.on("create", async (file: TFile) => {
				this.updateFrontmatterId(file);
			})
		);
	}

	onunload() {}

	async updateFrontmatterId(
		file: TFile,
		{
			/** 是否启用排除 */
			shouldExclude = true,
		}: {
			shouldExclude?: boolean;
		} = {}
	) {
		if (
			shouldExclude &&
			this.settings.exclude?.find((path) => file.path.startsWith(path))
		) {
			return;
		}

		const uuidFn = uuid[
			this.settings.version as keyof typeof uuid
		] as () => string;
		if (!uuidFn) {
			throw new Error(`Invalid UUID version: ${this.settings.version}`);
		}

		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			if (typeof frontmatter.id === "undefined") {
				frontmatter["id"] = uuidFn();
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DefaultSettings,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
