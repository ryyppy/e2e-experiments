import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import TestWorld from "features/support/TestWorld";

When(
  "User navigates to the {string} project page",
  async function (this: TestWorld, projectName: string) {
    const { page } = this;
    await page.goto(`https://github.com/${projectName}`);
  }
);

When("User selects the Pull Request tab", async function (this: TestWorld) {
  const { page } = this;

  await page.locator("id=pull-requests-tab").click();
});

Then(
  "The user should see the Pull Request list",
  async function (this: TestWorld) {
    const { page } = this;

    const numberOfPrs = await page.locator("text=/#[0-9]*/").count();

    expect(numberOfPrs).toBeGreaterThan(5);
  }
);
