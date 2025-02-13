import * as fs from "fs";
import * as path from "path";
import { Locator, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export async function insertInputValue(
  locator: Locator,
  value: string | number
) {
  await locator.fill("");
  await locator.fill(`${value}`);
}

export async function typeInputValue(locator: Locator, value: string | number) {
  await locator.clear();
  await expect(locator).toBeEmpty();
  await locator.click();
  await locator.pressSequentially(`${value}`, { delay: 100 });
  await locator.blur();
}

export const getJSONData = (filename: string) => {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../testdata/${filename}`), "utf-8")
  );
};

export const getPwTestAppTestData = () => getJSONData("pwTestAppTestData.json");

const randomizeIndex = (count: number) => {
  return Math.floor(count * Math.random());
};

export const randomizeElement = (array) => {
  const index = randomizeIndex(array.length);
  const element = array[index];
  return element;
};

export const getRandomEmailByNameAndCurrentYear = (randomFullName: string) => {
  let date = new Date();
  const emailMaxDate = date.getFullYear() - 18;
  const emailMinDate = date.getFullYear() - 100;
  const randomEmail = `${randomFullName
    .replace(" ", "")
    .toLowerCase()}${faker.number.int({
    min: emailMinDate,
    max: emailMaxDate,
  })}@test.com`;
  return randomEmail;
};

export function getCSVData(filePath: string): string[] {
  const data = fs.readFileSync(`testdata/${filePath}`, "utf-8");
  return data.split(",").map((age) => age.trim().replace(/^"|"$/g, ""));
}
