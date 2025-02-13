import { test } from '@playwright/test';
import { PageManager } from '../page-objects/shared/pageManager';
import { argosScreenshot } from "@argos-ci/playwright";

test(
	"Open 'Form layouts' page",
	{
		annotation: [
			{
				type: 'description',
				description: 'This is a simple test integrated with github and argos ci',
			},
		],
	},
	async ({ page }) => {
		const pm = new PageManager(page);
		await page.goto('/');
		await pm.navigateTo.formLayoutsPage();
		await argosScreenshot(page, "homepage");
	}
);
