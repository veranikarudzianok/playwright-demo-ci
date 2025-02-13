import { expect, Locator, Page } from "@playwright/test";
import { insertInputValue, typeInputValue } from "../helpers/helpers";
import { BasePage } from "./shared/basePage";

export class FormLayoutsPage extends BasePage {
  readonly pageContent: Locator;
  readonly usingTheGridForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly optionRadioBtn: Locator;
  readonly optionDisabledRadioBtn: Locator;
  readonly signInBtn: Locator;
  readonly optionRadioBtnLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.pageContent = this.page.locator(".layout-container .content .columns");
    this.usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    this.emailInput = this.usingTheGridForm.getByPlaceholder("Email");
    this.passwordInput = this.usingTheGridForm.locator("#inputPassword2");
    this.optionRadioBtn = this.usingTheGridForm.locator("nb-radio input");
    this.optionRadioBtnLabel = this.usingTheGridForm.locator("nb-radio label");
    this.optionDisabledRadioBtn =
      this.usingTheGridForm.getByLabel("Disabled Option");
    this.signInBtn = this.usingTheGridForm.getByRole("button");
  }

  async submitUsingTheGridFrom(
    email: string,
    password: string,
    optionIndex: number
  ) {
    await expect(this.emailInput).toBeVisible();
    await insertInputValue(this.emailInput, email);
    await expect(this.emailInput).toHaveValue(email ? email : "");
    await expect(this.passwordInput).toBeVisible();
    await typeInputValue(this.passwordInput, password);
    const passwordValue = await this.passwordInput.inputValue();
    expect(passwordValue).toEqual(password ? password : "");
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
  async sumbitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", { hasText: "Inline form" });
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);
    if (rememberMe)
      await inlineForm.getByRole("checkbox").check({ force: true });
    await inlineForm.getByRole("button").click();
  }
}
