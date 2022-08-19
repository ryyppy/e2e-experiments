// Inspired by
// https://github.com/Tallyb/cucumber-playwright/blob/master/src/support/custom-world.ts

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { BrowserContext, BrowserContextOptions, Page } from '@playwright/test';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

/**
 * The "world" interface before the setup in `setup.ts` has run.
 */
export interface TestWorldBeforeSetup extends World {
  debug: boolean;
  feature?: messages.Pickle;
  testName?: string;
  startTime?: Date;
  context?: BrowserContext;
  page?: Page;
  baseUrl?: string;
  testUserPassword?: string;

  newContext?(options?: BrowserContextOptions): Promise<void>;
}

/**
 * The "world" interface after the initial setup.
 * This is what Cucumber step definitions should rely on.
 * See https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
 */
export default interface TestWorld extends TestWorldBeforeSetup {
  feature: messages.Pickle;
  testName: string;
  startTime: Date;
  context: BrowserContext;
  page: Page;
  secondPage?: Page;
  state?: any;
  baseUrl: string;
  testUserPassword: string;
  /**
   * Creates a new browser context ("tab").
   * This can be used internally by step definitions that authenticate a user.
   */
  newContext(options?: BrowserContextOptions): Promise<void>;
}

class TestWorldImpl extends World implements TestWorldBeforeSetup {
  debug = false;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(TestWorldImpl);
