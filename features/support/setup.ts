// Inspired by
// https://github.com/Tallyb/cucumber-playwright/blob/master/src/support/common-hooks.ts

import { TestWorldBeforeSetup } from './TestWorld';
import { config } from './config';
import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  Page,
  webkit,
  WebKitBrowser,
} from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'test-results/traces';

setDefaultTimeout(config.testDebug ? -1 : 2 * 60 * 1000);

BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
  await ensureDir(tracesDir);
});

Before({ tags: '@ignore' }, async function () {
  return 'skipped';
});

Before({ tags: '@debug' }, async function (this: TestWorldBeforeSetup) {
  this.debug = true;
});

Before(async function (
  this: TestWorldBeforeSetup,
  { pickle }: ITestCaseHookParameter
) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  this.feature = pickle;
  this.baseUrl = config.baseUrl;
  this.testUserPassword = config.testUserPassword;

  this.newContext = async (options) => {
    // Customize the browser context:
    // https://playwright.dev/docs/next/api/class-browser#browser-new-context
    this.context = await browser.newContext({
      acceptDownloads: true,
      recordVideo: config.recordVideo
        ? { dir: 'test-results/videos' }
        : undefined,
      viewport: { width: 1200, height: 800 },
      ...options,
    });

    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.page = await this.context.newPage();
    this.page.on('console', async (msg) => {
      if (msg.type() === 'log') {
        await this.attach(msg.text());
      }
    });
  };

  await this.newContext();
});

After(async function (
  this: TestWorldBeforeSetup,
  { result }: ITestCaseHookParameter
) {
  if (result) {
    await this.attach(
      `Status: ${result?.status}. Duration:${result.duration?.seconds}s`
    );
    const image = await this.page?.screenshot();
    if (image) {
      await this.attach(image, 'image/png');
    }
    const timestampRaw = this.startTime?.toISOString().split('.')[0] || '';
    const timestamp = timestampRaw.replace(/:/g, '-');
    await this.context?.tracing.stop({
      path: `${tracesDir}/${this.testName}-${timestamp}-trace.zip`,
    });
  }
  await this.page?.close();
  await this.context?.close();
});


After(async function (scenario) {
});

AfterAll(async function () {
  await browser.close();
});
