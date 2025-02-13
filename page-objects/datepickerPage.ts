import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./shared/basePage";

export class DatePickerPage extends BasePage {
  readonly formPicker: Locator;
  readonly rightArrow: Locator;
  readonly calendarMonthAndYear: Locator;
  readonly dayCell: Locator;
  readonly rangePicker: Locator;
  readonly rangeCell: Locator;

  constructor(page: Page) {
    super(page);
    this.formPicker = this.page.getByPlaceholder("Form Picker");
    this.rightArrow = this.page.locator(
      'nb-calendar-pageable-navigation [data-name="chevron-right"]'
    );
    this.calendarMonthAndYear = this.page.locator("nb-calendar-view-mode");
    this.rangePicker = this.page.getByPlaceholder("Range Picker");
    this.dayCell = this.page.locator('[class="day-cell ng-star-inserted"]');
    this.rangeCell = this.page.locator(
      '[class="range-cell day-cell ng-star-inserted"]'
    );
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    await this.formPicker.click();
    const dateToAssert = await this.selectDateInTheCalendar(
      numberOfDaysFromToday
    );
    await expect(this.formPicker).toHaveValue(dateToAssert);
  }

  async selectDatePickerWithRangeFromToday(
    startDayFromToday: number,
    endDayFromToday: number
  ) {
    await this.rangePicker.click();
    const startDateToAssert = await this.selectDateInTheCalendar(
      startDayFromToday
    );
    const endDateToAssert = await this.selectDateInTheCalendar(endDayFromToday);
    const fullDateToAssert = `${startDateToAssert} - ${endDateToAssert}`;
    await expect(this.rangePicker).toHaveValue(fullDateToAssert);
  }

  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-US", {
      month: "short",
    });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    /* In case the expected date is not in the current month and year 
    then press the right arrow until you find the right date */
    let calendarMonthAndYear = await this.calendarMonthAndYear.textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.rightArrow.click();
      calendarMonthAndYear = await this.calendarMonthAndYear.textContent();
    }

    /* select expected date and validate the result */
    if (await this.dayCell.first().isVisible()) {
      await this.dayCell.getByText(expectedDate, { exact: true }).click();
    } else {
      await this.rangeCell.getByText(expectedDate, { exact: true }).click();
    }

    return dateToAssert;
  }
}
