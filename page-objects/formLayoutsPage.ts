import { expect, Locator, Page } from '@playwright/test';
import { insertInputValue, typeInputValue } from '../helpers/helpers';
import { BasePage } from './shared/basePage';

export class FormLayoutsPage extends BasePage {
	readonly pageContent: Locator;
	readonly usingTheGridForm: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly optionRadioBtn: Locator;
	readonly optionDisabledRadioBtn: Locator;
	readonly signInBtn: Locator;
	readonly optionRadioBtnLabel: Locator;
	readonly inlineForm: Locator;
	readonly nameInputInline: Locator;
	readonly emailInputInline: Locator;
	readonly rememberMeCheckboxInline: Locator;
	readonly submitBtnInline: Locator;

	constructor(page: Page) {
		super(page);
		this.pageContent = this.page.locator('.layout-container .content .columns');
		this.usingTheGridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' });
		this.emailInput = this.usingTheGridForm.getByPlaceholder('Email'); // XPath alternative: '(//nb-card-body/form/div/div/child::input)[1]'
		this.passwordInput = this.usingTheGridForm.locator('#inputPassword2');
		this.optionRadioBtn = this.usingTheGridForm.locator('nb-radio input'); // XPath alternative: '//input[type="radio"]'
		this.optionRadioBtnLabel = this.usingTheGridForm.locator('nb-radio label');
		this.optionDisabledRadioBtn = this.usingTheGridForm.getByLabel('Disabled Option'); // XPath alternative: '//span[contains(text(), 'Disabled')]'
		this.signInBtn = this.usingTheGridForm.getByRole('button'); // XPath alternative: '//button[text()="Sign in"]'
		this.inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' });
		this.nameInputInline = this.inlineForm.getByRole('textbox', { name: 'Jane Doe' });
		this.emailInputInline = this.inlineForm.getByRole('textbox', { name: 'Email' });
		this.rememberMeCheckboxInline = this.inlineForm.getByRole('checkbox');
		this.submitBtnInline = this.inlineForm.getByRole('button');
	}

	async submitUsingTheGridFrom(email: string, password: string, optionIndex: number) {
		await expect(this.emailInput).toBeVisible();
		await insertInputValue(this.emailInput, email);
		await expect(this.emailInput).toHaveValue(email);
		await expect(this.passwordInput).toBeVisible();
		await typeInputValue(this.passwordInput, password);
		const passwordValue = await this.passwordInput.inputValue();
		expect(passwordValue).toEqual(password);
		const selectedOption = await this.selectOptionByIndex(optionIndex);
		await expect(selectedOption).toBeChecked();
	}

	async selectOptionByIndex(index: number) {
		const optionToSelect = this.optionRadioBtn.nth(index);
		await optionToSelect.scrollIntoViewIfNeeded();

		/* 
    the element is "visually-hidden" according to implementation,
    checking the radio btn with the option { force: true } ("await optionToSelect.check({ force: true })") helps
    to disable accessibility check in headless, but still throws in headed mode,
    the method below directly modifies the checkbox state in the DOM to overcome the issue
    */
		await this.page.evaluate((el) => {
			(el as HTMLInputElement).checked = true;
		}, await optionToSelect.elementHandle());

		/* generages a 'golden' screenshot as a baseline on the first run, checks if there are differences on the second run */
		await expect(this.usingTheGridForm).toHaveScreenshot({ maxDiffPixels: 5 });

		/* the function returns the selected option of a certain index for further usage in the tests */
		return optionToSelect;
	}

	/**
	 * This method fill out the Inline form with user details
	 * @param name - should be first and last name
	 * @param email - valid email for the test user
	 * @param rememberMe - true or false if user session to be safed
	 */
	async sumbitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe?: boolean) {
		await this.nameInputInline.fill(name);
		await this.emailInputInline.fill(email);
		if (rememberMe) await this.rememberMeCheckboxInline.check({ force: true });
		await this.submitBtnInline.click();
	}
}
