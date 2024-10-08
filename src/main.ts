import { MarkdownView, Plugin, TFile } from "obsidian";
import * as uuid from "uuid";
import { DefaultSettings, FrontmatterIdSettings, SettingTab } from "./settings";
import { delay } from "./utils";

export default class FrontmatterIdPlugin extends Plugin {
	settings: FrontmatterIdSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: "generate-frontmatter-id",
			name: "Generate Frontmatter ID",
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
				await delay(500);
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

		if (!(file instanceof TFile) || file.extension !== "md") {
			return;
		}

		const uuidFn = uuid[
			this.settings.version as keyof typeof uuid
		] as () => string;
		if (!uuidFn) {
			throw new Error(`Invalid UUID version: ${this.settings.version}`);
		}

		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const { name } = this.settings;
			if (typeof frontmatter[name] === "undefined") {
				frontmatter[name] = uuidFn();
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
