import { expect } from "@playwright/test";
import { test } from "../test-options";
import { PageManager } from "../page-objects/shared/pageManager";
import {
  getCSVData,
  getPwTestAppTestData,
  randomizeElement,
} from "../helpers/helpers";
import * as allure from "allure-js-commons";
import * as path from "path";
import { ContentType } from "allure-js-commons";

const pwTestAppTestData = getPwTestAppTestData();

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe(
  "Form Layouts page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite demonstrates soft assertions, custom retry configuration for a specific test suite, and the use of test data parsed from an external JSON file. It also showcases the ability to reload the page when needed, such as in cases of poor performance. Additionally, it utilizes the optional testInfo parameter, which provides utilities for managing test execution.",
      },
    ],
  },
  () => {
    test.beforeEach(async ({ pm }) => {
      await pm.navigateTo.formLayoutsPage();
    });

    test.describe.configure({ retries: 3 });

    test("Submit 'Using the Grid' form @smoke", async ({ pm }, testInfo) => {
      //conditional refresh of the page in case of flakiness caused by low performance
      if (testInfo.retry) {
        pm.onFormLayoutsPage.page.reload();
      }

      await pm.onFormLayoutsPage.submitUsingTheGridFrom(
        pwTestAppTestData.using_the_grid.email,
        pwTestAppTestData.using_the_grid.password,
        pwTestAppTestData.using_the_grid.optionIndex
      );
      await expect
        .soft(pm.onFormLayoutsPage.optionDisabledRadioBtn)
        .toBeDisabled();
      await pm.onFormLayoutsPage.signInBtn.click();
    });
  }
);

test.describe(
  "Toastr page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite includes a test explicitly marked as 'should fail', ensuring Playwright verifies its failure as expected. Custom messages are used in assertions for clarity, and { force: true } is applied in certain methods to bypass actionability checks due to application limitations. The suite demonstrates various locator strategies, including the child combinator (>) for selecting direct children, iterating over multiple selectors, and leveraging .first() to target the initial matching locator when necessary.",
      },
    ],
  },
  () => {
    test("Check and uncheck checkboxes @sanity", async ({ pm }) => {
      test.fail(); // the test is expected to intentionally fail
      await pm.navigateTo.toastrPage();
      await pm.onToastrPage.uncheckAllCheckboxes();
      await pm.onToastrPage.checkAllCheckboxes();
      await pm.onToastrPage.tryToUncheckCheckboxByClick(); // expected to fail
    });

    test("Trigger toast message", async ({ pm }) => {
      await pm.navigateTo.toastrPage();
      await pm.onToastrPage.showToast("primary"); // type=primary is triggered by default
      const actualToastData = await pm.onToastrPage.parseToastData();
      const expectedPrimaryToastData = pwTestAppTestData.toastr_page.primary;
      const containsKeys = ["status"];
      Object.entries(expectedPrimaryToastData).forEach(([key, value]) => {
        if (containsKeys.includes(key)) {
          expect.soft(actualToastData[key]).toContain(value);
        } else {
          expect.soft(actualToastData[key]).toEqual(value);
        }
      });
    });
  }
);

test.describe(
  "Navigation page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite showcases two approaches for testing page color mode changes: iterating through all available colors using a for...in loop and selecting a random color via a helper function to ensure a more unbiased test. It also demonstrates various locator strategies, including simultaneously matching two locators with .and. To maintain flexibility and avoid hardcoded values, test data is sourced from an external JSON file. Additionally, the test is executed within a shared page object for better structure and reusability. Console logs are used.",
      },
    ],
  },
  () => {
    const colors = pwTestAppTestData.navigation_page.colors;

    test("Change color mode of the page @integration", async ({ pm }) => {
      await pm.onTopNavigationPane.checkAllPageColorModes(colors);
    });

    test("Set random color mode of the page @e2e", async ({ pm }) => {
      const allModes = pwTestAppTestData.navigation_page.allModes;
      const modeToSelect = await randomizeElement(allModes);
      console.log(`Mode to select: ${modeToSelect}`);
      await pm.onTopNavigationPane.pageModeDropdown.click();
      await pm.onTopNavigationPane.checkRandomPageColorMode(
        colors,
        modeToSelect
      );
    });
  }
);

test.describe(
  "Tooltip page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite involves locating a tooltip in the DOM using Chrome Developer Tools in debugging mode. It also captures and saves three screenshot variants in the repository after the test: a full-page screenshot, a screenshot of the tooltip locator, and a binary screenshot for integration with other services.",
      },
    ],
  },
  () => {
    test("Trigger a tooltip @regression", async ({ pm }) => {
      await pm.navigateTo.tooltipPage();
      await pm.onTooltipPage.triggerAndValidateTopTooltip();
      await allure.attachmentPath("Screenshot", path.resolve(__dirname, "..", "screenshots", "tooltipPage.png"), {
        contentType: ContentType.PNG,
        fileExtension: "png",
    });
    });
  }
);

test.describe(
  "Smart Table page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite sets up a listener for browser dialogs and interacts with them. Test data is sourced from external JSON and CSV files to avoid hardcoded values. For improved readability, tests are structured into clear steps. Smart locator methods are implemented to identify table rows dynamically, allowing the retrieval of a cell’s value based on another cell’s content. Additionally, a custom error message is triggered if the expected row is not found. Due to long animations on the page, waitForTimeout is utilized where necessary. To ensure precise element matching, the { exact: true } parameter is applied.",
      },
    ],
  },
  () => {
    test.beforeEach(async ({ pm }) => {
      await pm.navigateTo.smartTablePage();
    });

    test("Validate browser dialogs", async ({ page }) => {
      const pm = new PageManager(page);

      const emailToDelete =
        pwTestAppTestData.smart_table_page.user_to_delete.email;

      await test.step("Listen for the browser dialog", async () => {
        page.on("dialog", (dialog) => {
          expect(dialog.message()).toEqual("Are you sure you want to delete?");
          dialog.accept();
        });
      });

      await test.step("Delete the table row", async () => {
        const rowToDelete = await pm.onSmartTablePage.findTableRowByEmail(
          emailToDelete
        );
        rowToDelete.locator(".nb-trash").click();
      });

      await test.step("Make sure the row is deleted", async () => {
        for (const row of await page.locator("table tr").all()) {
          await expect(row).not.toContainText(emailToDelete);
        }
      });
    });
    test("Edit web table content", async ({ pm }) => {
      await test.step("Find a row by email and edit the age", async () => {
        const email = pwTestAppTestData.smart_table_page.user_to_edit_1.email;
        const targetRowByEmail = await pm.onSmartTablePage.findTableRowByEmail(
          email
        );
        const age = pwTestAppTestData.smart_table_page.user_to_edit_1.age;
        await pm.onSmartTablePage.editAndValidateUserAge(targetRowByEmail, age);
      });

      await test.step("Navigate to the page 2, find the row by id and edit the email", async () => {
        const id = pwTestAppTestData.smart_table_page.user_to_edit_2.id;
        const targetRowById = await pm.onSmartTablePage.findTableRowById(id);
        const email = pwTestAppTestData.smart_table_page.user_to_edit_2.email;
        await pm.onSmartTablePage.navigateToTablePage("2");
        await pm.onSmartTablePage.editAndValidateUserEmail(
          targetRowById,
          email
        );
      });

      await test.step("Filter by age and validate results", async () => {
        const ages = getCSVData("ages.csv");
        await pm.onSmartTablePage.filterByAge(ages);
      });
    });
  }
);

test.describe(
  "Datepicker page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite interacts with two Datepickers by selecting dates based on a specified number of days from today. All test steps are encapsulated within a dedicated page object file for better maintainability. The implementation leverages the JavaScript Date object and its related methods to calculate and set the desired dates dynamically.",
      },
    ],
  },
  () => {
    test("Select a certain date in the Date Picker", async ({ pm }) => {
      await pm.navigateTo.datePickerPage();
      await pm.onDatepickerPage.selectCommonDatePickerDateFromToday(255); // use any positive integer
      await pm.onDatepickerPage.selectDatePickerWithRangeFromToday(20, 30); // use any positive integers, the first one must me lower
    });
  }
);

test.afterAll(async ({}) => {
  // clean up test environment if needed
});