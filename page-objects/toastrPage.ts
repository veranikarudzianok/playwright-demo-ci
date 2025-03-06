import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './shared/basePage';

export class ToastrPage extends BasePage {
	readonly allCheckboxes: Locator;
	readonly toast: Locator;

	constructor(page: Page) {
		super(page);
		this.allCheckboxes = this.page.locator('label > .custom-checkbox');
		this.toast = this.page.locator('nb-toast');
	}

	async tryToUncheckCheckboxByClick() {
		const checkedCheckbox = this.page.locator('label > .custom-checkbox.checked').first();
		checkedCheckbox.click({ force: true });
		expect(await checkedCheckbox.isChecked()).toBeFalsy();
	}

	async checkAllCheckboxes() {
		for (const box of await this.allCheckboxes.all()) {
			await box.check({ force: true });
			expect(await box.isChecked(), 'The box should be checked').toBeTruthy();
		}
	}

	async uncheckAllCheckboxes() {
		for (const box of await this.allCheckboxes.all()) {
			await box.uncheck({ force: true });
			expect(await box.isChecked(), 'The box should be UNchecked').toBeFalsy();
		}
	}

	async showToast(type: any) {
		await this.page.getByRole('button', { name: 'Show toast' }).click();
		await this.page.waitForSelector(`.ng-trigger-fadeIn.status-primary`, { state: 'attached', timeout: 5000 });
		await this.waitToastAppears(type);
	}

	async waitToastAppears(toastType: 'primary' | 'success' | 'info' | 'warning' | 'danger') {
		await this.page.waitForSelector(`.ng-trigger-fadeIn.status-${toastType}`, { state: 'attached', timeout: 5000 });
	}

	async parseToastData() {
		const toastData = {
			status: await this.toast.getAttribute('class'),
			icon: await this.toast.locator('.icon-container g g').getAttribute('data-name'),
			title: await this.toast.locator('.content-container').innerText(),
			titleAndSubtitle: await this.toast.locator('.title.subtitle').textContent(),
			message: await this.toast.locator('.message').textContent(),
		};
		return toastData;
	}
}
