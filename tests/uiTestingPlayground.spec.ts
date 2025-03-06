import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/* according to implementation the button becomes accessible in 15s, 
  while the method allTextContents() does not wait for the ui element to be attached*/

test.describe.configure({ mode: 'parallel' });

test.describe(
	'UI Testing Playground - @dev',
	{
		annotation: [
			{
				type: 'description',
				description:
					'This test suite utilizes multiple strategies to wait for actions or selectors to become available. Additionally, all tests within this file are designed to run in parallel for improved execution efficiency.Also, all URLs used in the tests are stored in a separate .env file and are called here with process.env.URL.',
			},
		],
	},
	() => {

		test.beforeEach(async ({ page }) => {
			await page.goto(process.env.DEV);
			await page.getByText('Button Triggering AJAX Request').click();
			await expect.poll(async () => page.locator('#spinner').isVisible()).toBeTruthy(); // waiting for a dynamically changing value instead of using a timeout
		});

		test('Auto waiting: wait for state @critical', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			await successButton.waitFor({ state: 'attached' }); // solution line
			const text1 = await successButton.allTextContents();
			expect(text1).toContain('Data loaded with AJAX get request.');
		});

		test('Auto waiting: assertion timeout @high', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			await expect(successButton).toHaveText('Data loaded with AJAX get request.', {
				timeout: 20000, // solution line
			});
		});
	}
);

test.describe(
	'UI Testing Playground - @staging',
	{
		annotation: [
			{
				type: 'description',
				description:
					'This test suite utilizes multiple strategies to wait for actions or selectors to become available. Additionally, all tests within this file are designed to run in parallel for improved execution efficiency.Also, all URLs used in the tests are stored in a separate .env file and are called here with process.env.URL.',
			},
		],
	},
	() => {
		test.beforeEach(async ({ page }) => {
			await page.goto(process.env.STAGING);
			await page.getByText('Button Triggering AJAX Request').click();
		});

		test('Auto waiting: wait for selector @medium', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			await page.waitForSelector('.bg-success'); // solution line
			const text2 = await successButton.allTextContents();
			expect(text2).toContain('Data loaded with AJAX get request.');
		});

		test('Auto waiting: wait for response @low', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			const responsePromise = page.waitForResponse(response =>
				response.url() === 'http://uitestingplayground.com/ajaxdata' && response.status() === 200
					&& response.request().method() === 'GET'
			  );
			await responsePromise;
			const text2 = await successButton.allTextContents();
			expect(text2).toContain('Data loaded with AJAX get request.');
		});

		test('Auto waiting: wait for network calls to be completed', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			await page.waitForLoadState('networkidle'); // solution line
			const text2 = await successButton.allTextContents();
			expect(text2).toContain('Data loaded with AJAX get request.');
		});

		test.skip('Auto waiting: wait for timeout', async ({ page }) => {
			const successButton = page.locator('.bg-success');
			await page.waitForTimeout(16000); // solution line
			const text2 = await successButton.allTextContents();
			expect(text2).toContain('Data loaded with AJAX get request.');
		});

		test('Timeout (passes on retry #1)', async ({ page }, testInfo) => {
			await allure.epic('Web interface');
			await allure.feature('Essential features');
			await allure.story('Set test timeout');

			await allure.displayName('Timeout');
			await allure.owner('Veranika Rudzianok');
			await allure.tags('slow', 'retry');
			await allure.severity('minor');
			await allure.issue('https://veranikarudzianok.atlassian.net/jira/software/projects/DP/boards/1?selectedIssue=DP-3', 'JIRA-3');

			test.setTimeout(10000);

			if (testInfo.retry) {
				test.slow(); //let's increase the timeout in case of retry
				allure.label('flaky', 'true');
			}
			const successButton = page.locator('.bg-success');
			await successButton.click();
		});
	}
);

test.describe(
	'UI Testing Playground - @prod',
	{
		annotation: [
			{
				type: 'description',
				description:
					'This test suite utilizes multiple strategies to wait for actions or selectors to become available. Additionally, all tests within this file are designed to run in parallel for improved execution efficiency. Also, all URLs used in the tests are stored in a separate .env file and are called here with process.env.URL. One of the tests in this suite is intentionally designed to fail on the first attempt due to a timeout error. However, on subsequent retries, the test is deliberately slowed down using .slow().',
			},
		],
	},
	() => {
		test.beforeEach(async ({ page }) => {
			await page.goto(process.env.PROD);
		});

		test('Upload a document', async ({ page }) => {
			const frame = page.frameLocator('.container iframe');
			const [fileChooser] = await Promise.all([
				page.waitForEvent('filechooser'),
				await frame.getByText('Browse files', { exact: true }).click(),
			]);
			await fileChooser.setFiles('testdata/upload.docx');
			await expect(frame.locator('.success-file')).toBeAttached({
				timeout: 5000,
			});
		});
	}
);
