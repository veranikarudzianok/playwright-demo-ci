import { test as base } from "@playwright/test";
import { PageManager } from "./page-objects/shared/pageManager";

export type TestOptions = {
  pm: PageManager;
};

export const test = base.extend<TestOptions>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
