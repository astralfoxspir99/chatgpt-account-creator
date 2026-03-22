import { faker } from "@faker-js/faker";
import * as cheerio from "cheerio";

export interface AccountConfig {
  password: string;
  headless: boolean;
}

export interface CreatedAccount {
  email: string;
  password: string;
  name: string;
  createdAt: string;
  status: "success" | "failed" | "pending";
}

export interface LogEntry {
  timestamp: string;
  message: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

function randstr(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateRandomEmail(): Promise<{
  email: string;
  firstName: string;
  lastName: string;
}> {
  const response = await fetch("https://generator.email/", {
    method: "GET",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
    },
  });

  const text = await response.text();
  const $ = cheerio.load(text);
  const domains: string[] = [];

  $(".e7m.tt-suggestions")
    .find("div > p")
    .each(function () {
      domains.push($(this).text());
    });

  if (domains.length > 0) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const firstName = faker.person.firstName().replace(/["']/g, "");
    const lastName = faker.person.lastName().replace(/["']/g, "");
    const randomStr = randstr(5);
    const email = `${firstName}${lastName}${randomStr}@${domain}`.toLowerCase();

    return { email, firstName, lastName };
  }

  throw new Error("No domains found from generator.email");
}

export function generateRandomBirthday(): {
  year: number;
  month: number;
  day: number;
} {
  const today = new Date();
  const minYear = today.getFullYear() - 65;
  const maxYear = today.getFullYear() - 18;

  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12) + 1;

  let maxDay: number;
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    maxDay = 31;
  } else if ([4, 6, 9, 11].includes(month)) {
    maxDay = 30;
  } else {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      maxDay = 29;
    } else {
      maxDay = 28;
    }
  }

  const day = Math.floor(Math.random() * maxDay) + 1;

  return { year, month, day };
}

export function formatTimestamp(): string {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}
