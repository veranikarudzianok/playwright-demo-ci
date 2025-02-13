import { test, expect } from "@playwright/test";

test(
  "Drag and drop with iFrame",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite demonstrates how to interact with iFrames when testing a web page. It showcases two methods for performing drag-and-drop actions: using precise mouse movements and utilizing the dragTo method.",
      },
    ],
  },
  async ({ page }) => {
    // define variables
    const testWebsite = "https://www.globalsqa.com/demo-site/draganddrop/";
    const imageOne = "High Tatras 2";
    const imageTwo = "High Tatras 4";

    // open the website
    await page.goto(testWebsite, { timeout: 20000 });

    // switch to the frame
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

    // Approach 1: drad to a location
    await frame
      .locator("li", { hasText: imageOne })
      .dragTo(frame.locator("#trash"));

    // Approach 2: more presice control using the mouse
    await frame.locator("li", { hasText: imageTwo }).hover();
    await page.mouse.down();
    await frame.locator("#trash").hover();
    await page.mouse.up();

    // perform assertion
    await expect(frame.locator("#trash li h5")).toHaveText([
      imageOne,
      imageTwo,
    ]);
  }
);
