import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AdvancedPracticePage, {
  buildAdvancedImpactPreview,
  FinalAccountsImpactCard,
  ImpactPreviewCard,
  WhyThisEntryCard,
} from "@/app/practice/advanced/page";
import {
  buildAdvancedPracticeResult,
  checkAdvancedJournalAnswer,
  getAdvancedPracticeQuestionById,
  getAdvancedPracticeQuestionsByTopic,
  parseAdvancedJournalAnswerText,
} from "@/lib/accounting-core";

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

    expect(html).toContain("Share application money received");
    expect(html).toContain("The company received share application money of Rs.25,000 by bank");
    expect(html).toContain("Write your journal entry");
    expect(html).toContain("Check Answer");
    expect(html).toContain("Show Correct Entry");
    expect(html).not.toContain("How to read this preview");
    expect(html).not.toContain("Why this entry?");
    expect(html).not.toContain("Ledger Impact");
    expect(html).not.toContain("Trial Balance Impact");
    expect(html).not.toContain("Final Accounts Impact");
    expect(html).not.toContain("This shows how the correct journal entry affects each account.");
    expect(html).not.toContain("Trial Balance is used to check whether total debit equals total credit.");
  });

  it("builds a balanced read-only impact preview from the correct expected entry", () => {
    const question = getAdvancedPracticeQuestionById("company-share-issue-premium-practice");

    expect(question).toBeDefined();

    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("Bank A/c Dr. Rs.120000");
    expect(preview?.ledgerAccounts.map((account) => account.account)).toEqual([
      "Bank",
      "Securities Premium",
      "Share Capital",
    ]);
    expect(preview?.trialBalanceRows).toEqual([
      { account: "Bank", debit: 120000, credit: 0 },
      { account: "Securities Premium", debit: 0, credit: 20000 },
      { account: "Share Capital", debit: 0, credit: 100000 },
    ]);
    expect(preview?.debitTotal).toBe(120000);
    expect(preview?.creditTotal).toBe(120000);
    expect(preview?.agrees).toBe(true);
  });

  it("shows student-friendly explanation text when the post-check preview is rendered", () => {
    const question = getAdvancedPracticeQuestionById("company-share-issue-premium-practice");

    expect(question).toBeDefined();

    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(preview).not.toBeNull();

    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));

    expect(html).toContain("Step 2");
    expect(html).toContain("How to read this preview");
    expect(html).toContain("Use these steps to understand the correct answer flow.");
    expect(html).toContain("First read the correct journal entry.");
    expect(html).toContain("Then see how each account is affected in Ledger Impact.");
    expect(html).toContain("Finally check Trial Balance Impact to confirm total debit equals total credit.");
    expect(html).toContain("This preview is based on the correct expected answer, not the submitted answer.");
    expect(html).toContain("Step 3");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("This section shows account-level effects from the correct expected answer.");
    expect(html).toContain("Step 4");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("This shows how the correct journal entry affects each account.");
    expect(html).toContain("Debit side means the account is increased or recorded on the left side here.");
    expect(html).toContain("Trial Balance is used to check whether total debit equals total credit.");
    expect(html).toContain("This section confirms whether total debit equals total credit for the correct expected answer.");
  });

  it("exposes partner capital contribution in advanced Partnership mode with the post-check preview path", () => {
    const partnershipQuestions = getAdvancedPracticeQuestionsByTopic("partnership");
    const question = getAdvancedPracticeQuestionById("partnership-capital-contribution-practice");

    expect(partnershipQuestions[0].id).toBe("partnership-capital-contribution-practice");
    expect(question).toBeDefined();
    expect(question?.title).toBe("Partner capital introduced");
    expect(question?.prompt).toContain("Amit introduced capital of Rs.50,000 into the partnership by bank");

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Bank A/c Dr. Rs.50000", "To Cash A/c Rs.50000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Bank A/c Dr. Rs.50000");
    expect(result.correctEntry.journalText).toContain("To Amit Capital A/c Rs.50000");
    expect(question?.finalAccountsImpact).toEqual({
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Bank increases" },
        { label: "Capital", detail: "Amit Capital increases" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    });
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Amit Capital A/c Rs.50000");
    expect(preview?.journalText).not.toContain("Cash A/c");
    expect(preview?.debitTotal).toBe(50000);
    expect(preview?.creditTotal).toBe(50000);
    expect(preview?.agrees).toBe(true);

    const whyHtml = renderToStaticMarkup(createElement(WhyThisEntryCard, { lines: question!.whyThisEntry! }));
    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));
    const finalAccountsHtml = renderToStaticMarkup(createElement(FinalAccountsImpactCard, { impact: question!.finalAccountsImpact! }));
    const postCheckHtml = [result.correctEntry.journalText, whyHtml, html, finalAccountsHtml].join("");

    expect(whyHtml).toContain("Why this entry?");
    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Bank A/c");
    expect(html).toContain("Amit Capital A/c");
    expect(html).not.toContain("Cash A/c");
    expect(html).toContain("Balanced");
    expect(finalAccountsHtml).toContain("Final Accounts Impact");
    expect(finalAccountsHtml).toContain("Balance Sheet");
    expect(finalAccountsHtml).toContain("affected");
    expect(finalAccountsHtml).toContain("Asset");
    expect(finalAccountsHtml).toContain("Bank increases");
    expect(finalAccountsHtml).toContain("Capital");
    expect(finalAccountsHtml).toContain("Amit Capital increases");
    expect(finalAccountsHtml).toContain("Profit &amp; Loss");
    expect(finalAccountsHtml).toContain("no direct impact");
    expect(finalAccountsHtml).not.toContain("Cash decreases");
    expect(postCheckHtml.indexOf("Bank A/c Dr. Rs.50000")).toBeLessThan(postCheckHtml.indexOf("Why this entry?"));
    expect(postCheckHtml.indexOf("Why this entry?")).toBeLessThan(postCheckHtml.indexOf("How to read this preview"));
    expect(postCheckHtml.indexOf("How to read this preview")).toBeLessThan(postCheckHtml.indexOf("Ledger Impact"));
    expect(postCheckHtml.indexOf("Ledger Impact")).toBeLessThan(postCheckHtml.indexOf("Trial Balance Impact"));
    expect(postCheckHtml.indexOf("Trial Balance Impact")).toBeLessThan(postCheckHtml.indexOf("Final Accounts Impact"));
  });

  it("exposes share application money received in advanced Company mode with the post-check preview path", () => {
    const companyQuestions = getAdvancedPracticeQuestionsByTopic("company_accounts");
    const question = getAdvancedPracticeQuestionById("company-share-application-money-received-practice");

    expect(companyQuestions[0].id).toBe("company-share-application-money-received-practice");
    expect(companyQuestions[1].id).toBe("company-calls-in-advance-practice");
    expect(companyQuestions[2].id).toBe("company-debenture-redemption-at-par-practice");
    expect(companyQuestions[3].id).toBe("company-share-issue-premium-practice");
    expect(question).toBeDefined();
    expect(question?.title).toBe("Share application money received");
    expect(question?.prompt).toContain("The company received share application money of Rs.25,000 by bank");
    expect(question?.finalAccountsImpact).toBeUndefined();

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Bank A/c Dr. Rs.25000", "To Share Capital A/c Rs.25000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Bank A/c Dr. Rs.25000");
    expect(result.correctEntry.journalText).toContain("To Share Application A/c Rs.25000");
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Share Application A/c Rs.25000");
    expect(preview?.journalText).not.toContain("Share Capital A/c");
    expect(preview?.debitTotal).toBe(25000);
    expect(preview?.creditTotal).toBe(25000);
    expect(preview?.agrees).toBe(true);

    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));

    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Bank A/c");
    expect(html).toContain("Share Application A/c");
    expect(html).not.toContain("Share Capital A/c");
    expect(html).toContain("Balanced");
  });

  it("exposes calls in advance received in advanced Company mode with the post-check preview path", () => {
    const companyQuestions = getAdvancedPracticeQuestionsByTopic("company_accounts");
    const question = getAdvancedPracticeQuestionById("company-calls-in-advance-practice");

    expect(companyQuestions.slice(0, 3).map((companyQuestion) => companyQuestion.id)).toEqual([
      "company-share-application-money-received-practice",
      "company-calls-in-advance-practice",
      "company-debenture-redemption-at-par-practice",
    ]);
    expect(question).toBeDefined();
    expect(question?.title).toBe("Calls in advance received");
    expect(question?.prompt).toContain("The company received calls in advance of Rs.2,000 by bank");
    expect(question?.finalAccountsImpact).toBeUndefined();

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Bank A/c Dr. Rs.2000", "To Share Capital A/c Rs.2000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Bank A/c Dr. Rs.2000");
    expect(result.correctEntry.journalText).toContain("To Calls in Advance A/c Rs.2000");
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Calls in Advance A/c Rs.2000");
    expect(preview?.journalText).not.toContain("Share Capital A/c");
    expect(preview?.debitTotal).toBe(2000);
    expect(preview?.creditTotal).toBe(2000);
    expect(preview?.agrees).toBe(true);

    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));

    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Bank A/c");
    expect(html).toContain("Calls In Advance A/c");
    expect(html).not.toContain("Share Capital A/c");
    expect(html).toContain("Balanced");
  });

  it("exposes debenture redemption at par in advanced Company mode with the post-check preview path", () => {
    const companyQuestions = getAdvancedPracticeQuestionsByTopic("company_accounts");
    const partnershipQuestions = getAdvancedPracticeQuestionsByTopic("partnership");
    const question = getAdvancedPracticeQuestionById("company-debenture-redemption-at-par-practice");

    expect(companyQuestions.slice(0, 3).map((companyQuestion) => companyQuestion.id)).toEqual([
      "company-share-application-money-received-practice",
      "company-calls-in-advance-practice",
      "company-debenture-redemption-at-par-practice",
    ]);
    expect(companyQuestions[3].id).toBe("company-share-issue-premium-practice");
    expect(partnershipQuestions.slice(0, 3).map((partnershipQuestion) => partnershipQuestion.id)).toEqual([
      "partnership-capital-contribution-practice",
      "partnership-drawings-paid-cash-practice",
      "partnership-interest-on-capital-fluctuating-practice",
    ]);
    expect(question).toBeDefined();
    expect(question?.title).toBe("Debenture redemption at par");
    expect(question?.prompt).toContain("The company redeemed debentures of Rs.50,000 at par by bank");
    expect(question?.finalAccountsImpact).toBeUndefined();

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Debentures A/c Dr. Rs.50000", "To Share Capital A/c Rs.50000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Debentures A/c Dr. Rs.50000");
    expect(result.correctEntry.journalText).toContain("To Bank A/c Rs.50000");
    expect(question?.whyThisEntry).toEqual([
      "Debentures is debited because the debenture liability is being settled.",
      "Bank is credited because money is paid out through bank.",
    ]);
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Bank A/c Rs.50000");
    expect(preview?.journalText).not.toContain("Share Capital A/c");
    expect(preview?.debitTotal).toBe(50000);
    expect(preview?.creditTotal).toBe(50000);
    expect(preview?.agrees).toBe(true);

    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));
    const whyHtml = renderToStaticMarkup(createElement(WhyThisEntryCard, { lines: question!.whyThisEntry! }));
    const postCheckHtml = [result.correctEntry.journalText, whyHtml, html].join("");

    expect(whyHtml).toContain("Why this entry?");
    expect(whyHtml).toContain("These points explain the correct expected answer, not the submitted answer.");
    expect(whyHtml).toContain("Debentures is debited because the debenture liability is being settled.");
    expect(whyHtml).toContain("Bank is credited because money is paid out through bank.");
    expect(whyHtml).not.toContain("Share Capital");

    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Debentures A/c");
    expect(html).toContain("Bank A/c");
    expect(html).not.toContain("Share Capital A/c");
    expect(html).toContain("Balanced");
    expect(postCheckHtml.indexOf("Debentures A/c Dr. Rs.50000")).toBeLessThan(postCheckHtml.indexOf("Why this entry?"));
    expect(postCheckHtml.indexOf("Why this entry?")).toBeLessThan(postCheckHtml.indexOf("How to read this preview"));
    expect(postCheckHtml.indexOf("How to read this preview")).toBeLessThan(postCheckHtml.indexOf("Ledger Impact"));
    expect(postCheckHtml.indexOf("Ledger Impact")).toBeLessThan(postCheckHtml.indexOf("Trial Balance Impact"));
  });

  it("exposes partner drawings in cash in advanced Partnership mode with the post-check preview path", () => {
    const partnershipQuestions = getAdvancedPracticeQuestionsByTopic("partnership");
    const question = getAdvancedPracticeQuestionById("partnership-drawings-paid-cash-practice");

    expect(partnershipQuestions.slice(0, 2).map((partnershipQuestion) => partnershipQuestion.id)).toEqual([
      "partnership-capital-contribution-practice",
      "partnership-drawings-paid-cash-practice",
    ]);
    expect(question).toBeDefined();
    expect(question?.title).toBe("Partner drawings paid in cash");
    expect(question?.prompt).toContain("Amit withdrew cash of Rs.3,000 from the partnership for personal use");
    expect(question?.finalAccountsImpact).toEqual({
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Cash decreases" },
        { label: "Capital/Drawings", detail: "Amit Drawings increases and is adjusted against capital" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    });

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Amit Drawings A/c Dr. Rs.3000", "To Bank A/c Rs.3000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Amit Drawings A/c Dr. Rs.3000");
    expect(result.correctEntry.journalText).toContain("To Cash A/c Rs.3000");
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Cash A/c Rs.3000");
    expect(preview?.journalText).not.toContain("Bank A/c");
    expect(preview?.debitTotal).toBe(3000);
    expect(preview?.creditTotal).toBe(3000);
    expect(preview?.agrees).toBe(true);

    const whyHtml = renderToStaticMarkup(createElement(WhyThisEntryCard, { lines: question!.whyThisEntry! }));
    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));
    const finalAccountsHtml = renderToStaticMarkup(createElement(FinalAccountsImpactCard, { impact: question!.finalAccountsImpact! }));
    const postCheckHtml = [result.correctEntry.journalText, whyHtml, html, finalAccountsHtml].join("");

    expect(whyHtml).toContain("Why this entry?");
    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Amit Drawings A/c");
    expect(html).toContain("Cash A/c");
    expect(html).not.toContain("Bank A/c");
    expect(html).toContain("Balanced");
    expect(finalAccountsHtml).toContain("Final Accounts Impact");
    expect(finalAccountsHtml).toContain("Balance Sheet");
    expect(finalAccountsHtml).toContain("affected");
    expect(finalAccountsHtml).toContain("Asset");
    expect(finalAccountsHtml).toContain("Cash decreases");
    expect(finalAccountsHtml).toContain("Capital/Drawings");
    expect(finalAccountsHtml).toContain("Amit Drawings increases and is adjusted against capital");
    expect(finalAccountsHtml).toContain("Profit &amp; Loss");
    expect(finalAccountsHtml).toContain("no direct impact");
    expect(finalAccountsHtml).not.toContain("Bank increases");
    expect(postCheckHtml.indexOf("Amit Drawings A/c Dr. Rs.3000")).toBeLessThan(postCheckHtml.indexOf("Why this entry?"));
    expect(postCheckHtml.indexOf("Why this entry?")).toBeLessThan(postCheckHtml.indexOf("How to read this preview"));
    expect(postCheckHtml.indexOf("How to read this preview")).toBeLessThan(postCheckHtml.indexOf("Ledger Impact"));
    expect(postCheckHtml.indexOf("Ledger Impact")).toBeLessThan(postCheckHtml.indexOf("Trial Balance Impact"));
    expect(postCheckHtml.indexOf("Trial Balance Impact")).toBeLessThan(postCheckHtml.indexOf("Final Accounts Impact"));
  });

  it("exposes interest on capital under fluctuating capital in advanced Partnership mode with the post-check preview path", () => {
    const partnershipQuestions = getAdvancedPracticeQuestionsByTopic("partnership");
    const question = getAdvancedPracticeQuestionById("partnership-interest-on-capital-fluctuating-practice");

    expect(partnershipQuestions.slice(0, 3).map((partnershipQuestion) => partnershipQuestion.id)).toEqual([
      "partnership-capital-contribution-practice",
      "partnership-drawings-paid-cash-practice",
      "partnership-interest-on-capital-fluctuating-practice",
    ]);
    expect(partnershipQuestions[3].id).toBe("partnership-partner-salary-practice");
    expect(question).toBeDefined();
    expect(question?.title).toBe("Interest on capital under fluctuating capital");
    expect(question?.prompt).toContain("Interest on capital of Rs.5,000 is allowed to Amit under the fluctuating capital method");
    expect(question?.finalAccountsImpact).toBeUndefined();

    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Interest on Capital A/c Dr. Rs.5000", "To Amit Capital A/c Rs.5000"].join("\n"),
      topic: question!.topic,
      questionId: question!.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question!.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question: question!, checkResult });
    const preview = buildAdvancedImpactPreview(question!.expectedJournalEntries);

    expect(parseResult.status).toBe("parsed");
    expect(checkResult.isCorrect).toBe(false);
    expect(result.correctEntry.journalText).toContain("Interest on Capital A/c Dr. Rs.5000");
    expect(result.correctEntry.journalText).toContain("To Amit Current A/c Rs.5000");
    expect(question?.whyThisEntry).toEqual([
      "Interest on Capital is debited because interest is allowed to the partner.",
      "Amit Current is credited because the amount is credited to Amit under the fluctuating capital method.",
    ]);
    expect(preview).not.toBeNull();
    expect(preview?.journalText).toContain("To Amit Current A/c Rs.5000");
    expect(preview?.journalText).not.toContain("Amit Capital A/c");
    expect(preview?.debitTotal).toBe(5000);
    expect(preview?.creditTotal).toBe(5000);
    expect(preview?.agrees).toBe(true);

    const html = renderToStaticMarkup(createElement(ImpactPreviewCard, { preview: preview! }));
    const whyHtml = renderToStaticMarkup(createElement(WhyThisEntryCard, { lines: question!.whyThisEntry! }));

    expect(whyHtml).toContain("Why this entry?");
    expect(whyHtml).toContain("Interest on Capital is debited because interest is allowed to the partner.");
    expect(whyHtml).toContain("Amit Current is credited because the amount is credited to Amit under the fluctuating capital method.");
    expect(whyHtml).not.toContain("Amit Capital");

    expect(html).toContain("How to read this preview");
    expect(html).toContain("Ledger Impact");
    expect(html).toContain("Trial Balance Impact");
    expect(html).toContain("Interest On Capital A/c");
    expect(html).toContain("Amit Current A/c");
    expect(html).not.toContain("Amit Capital A/c");
    expect(html).toContain("Balanced");
  });
});
