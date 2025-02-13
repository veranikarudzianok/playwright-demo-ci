import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class TopNavigationPane extends BasePage {
  public readonly headerContent: Locator;
  public readonly logo: Locator;
  public readonly sideBarToggle: Locator;
  public readonly pageModeDropdown: Locator;
  public readonly modeOptionList: Locator;

  constructor(page: Page) {
    super(page);
    this.headerContent = this.page.locator("nb-layout-header", {
      hasText: "test",
    });
    this.logo = this.headerContent.locator(".logo");
    this.sideBarToggle = this.headerContent
      .getByRole("link")
      .and(this.page.locator(".sidebar-toggle"));
    this.pageModeDropdown = this.headerContent.locator("nb-select button");
    this.modeOptionList = this.page.locator("nb-option-list nb-option");
  }

  async checkAllPageColorModes(colors: string[]) {
    await this.pageModeDropdown.click();
    for (const color in colors) {
      await this.modeOptionList.filter({ hasText: color }).click();
      await expect(this.headerContent).toHaveCSS(
        "background-color",
        colors[color]
      );
      if (color != "Corporate") {
        await this.pageModeDropdown.click();
      }
    }
  }

  async checkRandomPageColorMode(colors: string[], modeToSelect: string) {
    for (const modeOption of await this.modeOptionList.all()) {
      const modeText = (await modeOption.textContent()).trim();
      if (modeText == modeToSelect) {
        await modeOption.click();
        for (const color in colors) {
          if (color.replace(/[^a-zA-Z0-9 ]/g, "") == modeText) {
            await expect(this.headerContent).toHaveCSS(
              "background-color",
              colors[color]
            );
          }
        }
        break;
      }
    }
  }
}
