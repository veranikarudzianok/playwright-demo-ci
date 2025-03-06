import { Page } from '@playwright/test';

export class BasePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async waitForNumberOfSeconds(timeInSeconds: number) {
		await this.page.waitForTimeout(timeInSeconds * 1000);
	}
}
