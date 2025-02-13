import { expect, Locator, Page } from "@playwright/test";
import { insertInputValue } from "../helpers/helpers";
import { BasePage } from "./shared/basePage";

export class SmartTablePage extends BasePage {
  readonly ageInput: Locator;
  readonly confirmCheckmark: Locator;
  readonly emailInput: Locator;
  readonly ageFilter: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.ageInput = this.page.locator("input-editor").getByPlaceholder("Age");
    this.ageFilter = this.page.locator("input-filter").getByPlaceholder("Age");
    this.emailInput = this.page
      .locator("input-editor")
      .getByPlaceholder("E-mail");
    this.confirmCheckmark = this.page.locator(".nb-checkmark");
    this.tableRows = this.page.locator("tbody tr");
  }

  async findTableRowByEmail(email: string) {
    return this.page.getByRole("row", { name: email });
  }

  /**
   * This is a smart method that returns an index of the column "ID"
   * so that it can be reused when locating a certain row cell and also in futher assersions.
   *
   * Potentially the method might be improved to return an index of any column (email, age etc.)
   * provided as an argument.
   * @returns
   */
  async findIdColumnIndex() {
    const headerColumns = await this.page
      .locator("thead")
      .locator("tr")
      .nth(0)
      .locator("th")
      .all();
    let columnIndex = -1;

    for (let i = 0; i < headerColumns.length; i++) {
      const hasClass = await headerColumns[i].evaluate((th) =>
        th.classList.contains("id")
      );
      if (hasClass) {
        columnIndex = i;
        break;
      }
    }
    return columnIndex;
  }

  async findTableRowById(id: string) {
    const idIndex = await this.findIdColumnIndex();
    return this.page.getByRole("row").filter({
      has: this.page.locator("td").nth(idIndex).getByText(id, { exact: true }),
    });
  }

  async enterEmail(emailAddress: string) {
    await expect(this.emailInput).toBeVisible();
    await insertInputValue(this.emailInput, emailAddress);
  }

  async enterAge(age: string) {
    await expect(this.ageInput).toBeVisible();
    await insertInputValue(this.ageInput, age);
  }

  async openRowInEditMode(targetRow: Locator) {
    try {
      await targetRow.locator(".nb-edit").click();
    } catch (e) {
      throw new Error(
        "The row to click on is not found. Please try again with another row."
      );
    }
  }

  async filterByAge(ages: string[]) {
    for (let age of ages) {
      console.log(age);
      await this.ageFilter.fill(age);
      await this.page.waitForTimeout(500); //required a tiny timeout for the animation to be completed

      for (let row of await this.tableRows.all()) {
        const cellValue = await row.locator("td").last().textContent();

        if (age == "200") {
          expect(await this.page.getByRole("table").textContent()).toContain(
            "No data found"
          );
        } else {
          expect(cellValue).toEqual(age);
        }
      }
    }
  }

  async editAndValidateUserAge(targetRow: Locator, age: string) {
    await this.openRowInEditMode(targetRow);
    await this.enterAge(age);
    await this.confirmCheckmark.click();
    await expect(targetRow.locator("td").nth(6)).toHaveText(age);
  }

  async editAndValidateUserEmail(targetRow: Locator, email: string) {
    await this.openRowInEditMode(targetRow);
    await this.enterEmail(email);
    await this.confirmCheckmark.click();
    await expect(targetRow.locator("td").nth(5)).toHaveText(email);
  }

  /**
   * Currently availablle pages 1-4
   */
  async navigateToTablePage(page: string) {
    await this.page
      .locator(".ng2-smart-pagination-nav")
      .getByText(page)
      .click();
  }
}
