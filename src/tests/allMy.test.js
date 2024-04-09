import { expect, test, describe } from "bun:test";
import { getText } from "../scrapingReWebsite";

describe("getText", () => {
  test("should return the text content of the selected element", async () => {
    const html = "<div><p>Hello, World!</p></div>";
    const selector = "p";
    const index = 0;

    const result = await getText(html, selector, index);

    expect(result).toBe("Hello, World!");
  });

  test("should return an empty string if an invalid selector is provided", async () => {
    const html = "<div><p>Hello, World!</p></div>";
    const selector = "span"; // Invalid selector
    const index = 0;

    const result = await getText(html, selector, index);

    expect(result).toBe("");
  });

  test("should return an empty string if an out-of-bounds index is provided", async () => {
    const html = "<div><p>Hello, World!</p></div>";
    const selector = "p";
    const index = 1; // Out of bounds index

    const result = await getText(html, selector, index);

    expect(result).toBe("");
  });
});
