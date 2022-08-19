// Inspired by
// https://github.com/Tallyb/cucumber-playwright/blob/master/src/support/config.ts

import { LaunchOptions } from "@playwright/test";
import dotenv from "dotenv";

export function envBoolean(
  value?: string | boolean | number | undefined | null
) {
  const lower = typeof value === "string" ? value.toLowerCase() : null;
  if (
    value === true ||
    value === 1 ||
    lower === "true" ||
    lower === "yes" ||
    lower === "on" ||
    lower === "1"
  ) {
    return true;
  }
  if (
    value === false ||
    value === 0 ||
    lower === "false" ||
    lower === "no" ||
    lower === "off" ||
    lower === "0"
  ) {
    return false;
  }
  return null;
}

// Load environment variables from .env file.
// This is especially useful for local development;
// in CI builds, environment variables are defined in the GitHub environment.
dotenv.config();

const browserOptions: LaunchOptions = {
  slowMo: 0,
  args: [
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
  ],
  firefoxUserPrefs: {
    "media.navigator.streams.fake": true,
    "media.navigator.permission.disabled": true,
  },
  headless: envBoolean(process.env.TEST_HEADLESS) !== false,
};

export const config = {
  browser: process.env.BROWSER || "chromium",
  browserOptions,
  baseUrl: process.env.EXTERNAL_URL || "http://localhost:3000",
  recordVideo: false,
  testDebug: envBoolean(process.env.TEST_DEBUG),
  testUserPassword: process.env.TEST_USER_PASSWORD,
};
