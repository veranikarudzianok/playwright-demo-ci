import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SideNavigationPane extends BasePage {
  readonly formLayoutsMenuItem: Locator;
  readonly ioTDashboardMenuItem: Locator;
  readonly toastrMenuItem: Locator;
  readonly tooltipMenuItem: Locator;
  readonly smartTableMenuItem: Locator;
  readonly datePickerMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.formLayoutsMenuItem = this.page.getByText("Form Layouts");
    this.ioTDashboardMenuItem = this.page.getByText("IoT Dashboard");
    this.toastrMenuItem = this.page.getByText("Toastr");
    this.tooltipMenuItem = this.page.getByText("Tooltip");
    this.smartTableMenuItem = this.page.getByText("Smart Table");
    this.datePickerMenuItem = this.page.getByText("Datepicker");
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") {
      await groupMenuItem.click();
    }
  }

  async ioTDashboardPage() {
    await this.ioTDashboardMenuItem.click();
    await expect(this.page).toHaveURL(/.*iot-dashboard/);
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.formLayoutsMenuItem.click();
    await this.waitForNumberOfSeconds(1);
    await expect(this.page).toHaveURL(/.*layouts/);
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.toastrMenuItem.click();
    await this.waitForNumberOfSeconds(1);
    await expect(this.page).toHaveURL(/.*toastr/);
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.tooltipMenuItem.click();
    await this.waitForNumberOfSeconds(1);
    await expect(this.page).toHaveURL(/.*tooltip/);
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.smartTableMenuItem.click();
    await this.waitForNumberOfSeconds(1);
    await expect(this.page).toHaveURL(/.*smart-table/);
  }

  async datePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.datePickerMenuItem.click();
    await this.waitForNumberOfSeconds(1);
    await expect(this.page).toHaveURL(/.*datepicker/);
  }
}
