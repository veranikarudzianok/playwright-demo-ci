import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './shared/basePage';

export class TooltipPage extends BasePage {
	readonly triggerBtn: Locator;
	readonly tooltip: Locator;

	constructor(page: Page) {
		super(page);
		this.triggerBtn = this.page.getByRole('button', { name: 'Top' });
		this.tooltip = this.page.locator('nb-tooltip');
	}

	async triggerAndValidateTopTooltip() {
		await this.triggerBtn.hover();
		const tooltipText = await this.tooltip.textContent();

		// screenshot of the entire page
		await this.page.screenshot({ path: 'screenshots/tooltipPage.png' });

		// screenshot of the tooltip locator
		await this.page.locator('nb-tooltip').screenshot({ path: 'screenshots/tooltip.jpeg' });

		// screenshot as binary for integration with other service
		const buffer = await this.page.screenshot();

		expect(tooltipText).toEqual('This is a tooltip');
		await expect(this.tooltip).toHaveClass(/top/);
	}
}
