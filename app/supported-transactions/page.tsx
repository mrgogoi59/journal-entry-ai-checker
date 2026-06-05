import Link from "next/link";

const supportedTransactions = [
  "Simple cash and bank transactions",
  "Capital introduced",
  "Drawings in cash or bank",
  "Purchases and sales",
  "Purchases and sales with named parties",
  "Rent and salary paid",
  "Debtor receipt and creditor payment",
  "Bank deposit and withdrawal",
  "Loan taken and repaid",
  "Interest paid and received",
  "Commission received",
  "Digital payments like UPI, GPay, PhonePe, and NEFT as Bank",
  "Partial goods purchase: part cash or bank, balance credit",
  "Partial goods sale: part cash or bank received, balance credit",
  "Depreciation on machinery, furniture, computer, equipment, or vehicle",
  "Bad debts written off",
  "Bad debts recovered in cash, bank, or digital mode",
  "Outstanding expenses for salary, rent, wages, electricity, and insurance",
  "Prepaid expenses for rent, insurance, salary, wages, and electricity",
  "Accrued income for interest, commission, and rent",
  "Income received in advance for rent, commission, and interest",
  "Discount allowed or received in full-settlement debtor/creditor cases",
  "Goods withdrawn by proprietor or owner for personal use",
];

const unsupportedTransactions = [
  "GST",
  "GST with discount",
  "Provision-related discounts",
  "Broad settlement and ledger treatment beyond the journal entry",
  "Trade discount in invoice unless the wording matches supported trade-discount cases",
  "Goods distributed as free sample",
  "Goods given as charity",
  "Goods lost by fire or theft",
  "Sales return",
  "Purchase return",
  "Provision for doubtful debts",
  "Complex recovery with provision adjustment",
  "Ledger treatment after bad debt recovery",
  "Full final accounts treatment",
  "Broad final account adjustments",
  "Final accounts",
  "Ledger posting",
  "Trial balance",
  "Broad compound entries",
  "Complex partnership or company accounts",
];

const exampleTransactions = [
  "Bought goods for cash Rs.5000",
  "Sold goods to Raju Rs.5000",
  "Paid rent by UPI Rs.2000",
  "Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit",
  "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
  "Depreciation charged on machinery Rs.5000",
  "Depreciation provided on furniture Rs.2000",
  "Bad debts written off Rs.2000",
  "Raju became insolvent and Rs.1000 became bad debt",
  "Bad debts recovered Rs.500 in cash",
  "Bad debts recovered Rs.500 through bank",
  "Bad debts recovered from Raju Rs.500 in cash",
  "Salary outstanding Rs.6000",
  "Rent outstanding Rs.5000",
  "Wages outstanding Rs.4000",
  "Electricity bill outstanding Rs.2000",
  "Insurance outstanding Rs.3000",
  "Prepaid rent Rs.5000",
  "Insurance paid in advance Rs.3000",
  "Salary paid in advance Rs.6000",
  "Prepaid wages Rs.4000",
  "Electricity bill paid in advance Rs.2000",
  "Interest accrued Rs.1500",
  "Commission earned but not received Rs.3000",
  "Rent receivable Rs.4000",
  "Rent received in advance Rs.4000",
  "Commission received in advance Rs.3000",
  "Interest received in advance Rs.1500",
  "Received Rs.9500 from Mohan in full settlement of Rs.10000",
  "Received Rs.9500 from debtor and allowed discount Rs.500",
  "Paid Rs.4500 to Ram in full settlement of Rs.5000",
  "Paid Rs.4500 to creditor and received discount Rs.500",
  "Goods worth Rs.2000 withdrawn by proprietor for personal use",
  "Owner took goods Rs.1500 for personal use",
  "Goods withdrawn by owner Rs.1000 for home use",
];

export default function SupportedTransactionsPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[920px] flex-col gap-4 sm:gap-5">
        <header>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-blue-700">
            Back to checker
          </Link>
          <p className="mt-4 text-sm font-semibold text-accent">Supported Transactions</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            What This Checker Can Handle
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Use this page to choose transaction wording that fits the current beginner rule library.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <InfoCard title="Supported now" items={supportedTransactions} accent="blue" />
          <InfoCard title="Not supported yet" items={unsupportedTransactions} accent="red" />
        </section>

        <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
          <h2 className="text-sm font-bold text-ink">How to write better transactions</h2>
          <div className="mt-3 grid gap-2">
            {exampleTransactions.map((example) => (
              <div
                key={example}
                className="rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm leading-6 text-slate-800"
              >
                {example}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "blue" | "red";
}) {
  const markerClass = accent === "blue" ? "bg-accent" : "bg-red-500";

  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={`mt-2 h-2 w-2 flex-none rounded-full ${markerClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
