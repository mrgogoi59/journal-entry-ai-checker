import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AdvancedPracticePage from "@/app/practice/advanced/page";

describe("AdvancedPracticePage", () => {
  it("renders the Advanced Journal Entry Practice page shell", () => {
    const html = renderToStaticMarkup(createElement(AdvancedPracticePage));

    expect(html).toContain("Advanced Journal Entry Practice");
    expect(html).toContain("Beta");
    expect(html).toContain("Company Accounts");
    expect(html).toContain("Partnership Accounts");
    expect(html).toContain("Mixed");
  });

  it("renders the default Company Accounts question and answer controls", () => {
    const html = renderToStaticMarkup(createElement(AdvancedPracticePage));

    expect(html).toContain("Share issue at premium");
    expect(html).toContain("A company issued shares and received Rs.1,20,000 in bank");
    expect(html).toContain("Write your journal entry");
    expect(html).toContain("Check Answer");
    expect(html).toContain("Show Correct Entry");
  });
});
