import { Page } from "@playwright/test";
import { SideNavigationPane } from "./sideNavigationPane";
import { FormLayoutsPage } from "../formLayoutsPage";
import { ToastrPage } from "../toastrPage";
import { DatePickerPage } from "../datepickerPage";
import { IoTDashboardPage } from "../ioTDashboardPage";
import { TopNavigationPane } from "./topNavigationPane";
import { TooltipPage } from "../tooltipPage";
import { SmartTablePage } from "../smartTablePage";

export class PageManager {
  private readonly page: Page;
  private readonly sideNavigationPane: SideNavigationPane;
  private readonly formLayoutsPage: FormLayoutsPage;
  private readonly toastrPage: ToastrPage;
  private readonly datepickerPage: DatePickerPage;
  private readonly ioTDashboardPage: IoTDashboardPage;
  private readonly topNavigationPane: TopNavigationPane;
  private readonly tooltipPage: TooltipPage;
  private readonly smartTablePage: SmartTablePage;

  constructor(page: Page) {
    this.page = page;
    this.sideNavigationPane = new SideNavigationPane(this.page);
    this.formLayoutsPage = new FormLayoutsPage(this.page);
    this.toastrPage = new ToastrPage(this.page);
    this.datepickerPage = new DatePickerPage(this.page);
    this.ioTDashboardPage = new IoTDashboardPage(this.page);
    this.topNavigationPane = new TopNavigationPane(this.page);
    this.tooltipPage = new TooltipPage(this.page);
    this.smartTablePage = new SmartTablePage(this.page);
  }

  get navigateTo() {
    return this.sideNavigationPane;
  }

  get onFormLayoutsPage() {
    return this.formLayoutsPage;
  }

  get onDatepickerPage() {
    return this.datepickerPage;
  }

  get onToastrPage() {
    return this.toastrPage;
  }

  get onIoTDashboardPage() {
    return this.ioTDashboardPage;
  }

  get onTopNavigationPane() {
    return this.topNavigationPane;
  }

  get onTooltipPage() {
    return this.tooltipPage;
  }

  get onSmartTablePage() {
    return this.smartTablePage;
  }
}
