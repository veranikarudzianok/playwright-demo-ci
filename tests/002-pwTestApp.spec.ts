import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/shared/pageManager";

test.describe(
  "IoT Dashboard page",
  {
    annotation: [
      {
        type: "description",
        description:
          "This test suite demonstrates two approaches for interacting with a slider: directly modifying its attributes in the DOM and adjusting it pixel-by-pixel using precise mouse movements within its bounding box. A video is recorded with a custom viewport and saved in the repository upon test completion. Additionally, the scrollIntoViewIfNeeded method is utilized to ensure visibility when working with a specific image on the page.",
      },
    ],
  },
  () => {
    
    test("Move the slider: update attributes @daily", async ({ browser }) => {
      const context = await browser.newContext({
        recordVideo: { dir: "videos/", size: { width: 1280, height: 720 } }, // Save videos in "videos/" folder
      });

      const page = await context.newPage();
      await page.goto("/");
      const pm = new PageManager(page);

      await test.step("Update cx and cy attributes of the temp box circle in orded to move it", async () => {
        const tempGauge = pm.onIoTDashboardPage.tempBox.locator("circle");
        await tempGauge.evaluate((node) => {
          node.setAttribute("cx", "232.630");
          node.setAttribute("cy", "232.630");
        });
        await tempGauge.click();
        await expect(pm.onIoTDashboardPage.tempBox).toContainText("30");
      });

      await test.step("Ensure the temp box returns correct value", async () => {
        await expect(pm.onIoTDashboardPage.tempBox).toContainText("30");
      });

      await test.step("Close the context to ensure the recorded video gets saved", async () => {
        await context.close();
      });
    });

    test("Move the slider: manupulating the mouse @weekly", async ({
      browser,
    }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto("/");
      const pm = new PageManager(page);

      const box = await test.step("Create a bounding box", async () => {
        await pm.onIoTDashboardPage.tempBox.scrollIntoViewIfNeeded();
        return await pm.onIoTDashboardPage.tempBox.boundingBox();
      });

      await test.step("Move the mouse into the bounding box", async () => {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y); // put the mouse to the location you're starting from
        await page.mouse.down(); // simulates clicking left key btm of the mouse
        await page.mouse.move(x + 100, y); // move 100px to the right
        await page.mouse.move(x + 100, y + 100); // move 100px down
        await page.mouse.up(); // release
        await expect(pm.onIoTDashboardPage.tempBox).toContainText("30");
      });

      await test.step("Ensure the temp box returns correct value", async () => {
        await expect(pm.onIoTDashboardPage.tempBox).toContainText("30");
      });

      await test.step("Close the context", async () => {
        await context.close();
      });
    });
  }
);
