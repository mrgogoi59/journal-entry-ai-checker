import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PracticePage from "@/app/practice/page";

describe("PracticePage", () => {
  it("renders beginner practice content and the Advanced Practice Beta discovery link", () => {
    const html = renderToStaticMarkup(createElement(PracticePage));

    expect(html).toContain("Topic-wise Practice");
    expect(html).toContain("Choose a topic");
    expect(html).toContain("Basics");
    expect(html).toContain("Advanced Practice Beta");
    expect(html).toContain("Open Advanced Practice");
    expect(html).toContain('href="/practice/advanced"');
  });
});
