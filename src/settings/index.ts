import { App, PluginSettingTab, Setting } from "obsidian";

import FrontmatterIdPlugin from "../main";
import { FolderSuggestModal } from "./folder-suggest-modal";

export interface FrontmatterIdSettings {
	name: string;
	exclude?: string[];
	version: string;
}

export const DefaultSettings: FrontmatterIdSettings = {
	name: "id",
	version: "v7",
};

const options = ["v1", "v3", "v4", "v5", "v6", "v7"];

export class SettingTab extends PluginSettingTab {
	plugin: FrontmatterIdPlugin;

	constructor(app: App, plugin: FrontmatterIdPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.displayName();
		this.displayVersion();
		this.displayExclude();
	}

	displayName(): void {
		new Setting(this.containerEl).setName("Name").addText((text) =>
			text.setValue(this.plugin.settings.name).onChange(async (value) => {
				this.plugin.settings.name = value;
				await this.plugin.saveSettings();
			})
		);
	}

	displayVersion(): void {
		new Setting(this.containerEl)
			.setName("UUID's Version")
			.addDropdown((dropdown) =>
				options
					.reduce(
						(dropdown, option) =>
							dropdown.addOption(option, option),
						dropdown
					)
					.setValue(this.plugin.settings.version)
					.onChange(async (value) => {
						this.plugin.settings.version = value;
						await this.plugin.saveSettings();
					})
			);
	}

	displayExclude(): void {
		new Setting(this.containerEl)
			.setName("Exclude")
			.setDesc("List of folder to exclude from UUID generation.")
			.addButton((button) =>
				button.setButtonText("+").onClick(async () => {
					new FolderSuggestModal(this.app)
						.onConfirm(async (folder) => {
							this.plugin.settings.exclude = Array.from(
								new Set([
									...(this.plugin.settings.exclude ?? []),
									folder.path,
								])
							);
							await this.plugin.saveSettings();
							this.display();
						})
						.open();
				})
			);

		this.plugin.settings.exclude?.forEach((value, index) => {
			new Setting(this.containerEl)
				.setName(value)
				.addExtraButton((button) =>
					button.setIcon("x").onClick(async () => {
						this.plugin.settings.exclude?.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
					})
				);
		});
	}
}
