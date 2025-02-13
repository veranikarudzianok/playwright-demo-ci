import { Locator, Page } from "@playwright/test";
import { BasePage } from "./shared/basePage";

export class IoTDashboardPage extends BasePage {
  readonly tempBox: Locator;

  constructor(page: Page) {
    super(page);
    this.tempBox = this.page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger'
    );
  }
}
