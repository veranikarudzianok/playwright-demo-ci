import { test } from "@playwright/test";
import { PageManager } from "../page-objects/shared/pageManager";
import { getRandomEmailByNameAndCurrentYear } from "../helpers/helpers";
import { faker } from "@faker-js/faker";

test(
  "Submit 'Inline' form",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test runs in a mobile device emulator and utilizes the testInfo parameter, which provides utilities for managing test execution. This test suite also employs a visual testing approach, where a snapshot is taken during the test and compared to the current state of the page in subsequent runs.",
      },
    ],
  },
  async ({ page }, testInfo) => {
    const pm = new PageManager(page);
    await page.goto("/");

    if (testInfo.project.name == "mobile") {
      await pm.onTopNavigationPane.sideBarToggle.click();
    }

    await pm.navigateTo.formLayoutsPage();

    if (testInfo.project.name == "mobile") {
      await pm.onTopNavigationPane.sideBarToggle.click();
    }

    const randomFullName = faker.person.fullName({ sex: "female" });
    const randomEmail = getRandomEmailByNameAndCurrentYear(randomFullName);
    await pm.onFormLayoutsPage.sumbitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      false
    );
  }
);
