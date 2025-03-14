import { Page } from '@playwright/test';

export abstract class BasePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async waitForNumberOfSeconds(timeInSeconds: number) {
		await this.page.waitForTimeout(timeInSeconds * 1000);
	}

	async getCurrentUrl(): Promise<string> {
		return this.page.url();
	}
}
