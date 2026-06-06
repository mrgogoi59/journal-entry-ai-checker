import Link from "next/link";

const supportedTransactions = [
  "Simple cash and bank transactions",
  "Capital introduced",
  "Drawings in cash or bank",
  "Purchases and sales",
  "Purchases and sales with named parties",
  "Rent and salary paid",
  "More common expenses paid in cash, bank, or digital mode",
  "More asset purchases in cash, bank, digital mode, or credit",
  "Standalone installation, fitting, setup, freight, or carriage charges on fixed assets",
  "Fixed asset purchase plus installation-related charges in the same simple transaction",
  "Asset sales without GST, depreciation, or profit/loss calculation",
  "Asset sales with simple profit/loss calculation when book value and sale value are given",
  "Asset sales with accumulated depreciation using Asset Disposal A/c in simple controlled cases",
  "Debtor receipt and creditor payment",
  "Bank deposit and withdrawal",
  "Loan taken and repaid",
  "Interest paid and received",
  "Commission received",
  "More common incomes received in cash, bank, or digital mode",
  "Digital payments like UPI, GPay, PhonePe, and NEFT as Bank",
  "Basic GST on goods purchases and sales — plus GST and GST-inclusive amounts with GST rate",
  "CGST/SGST and IGST split on goods purchases and sales with clear tax rates or amounts, including GST-inclusive split with rates",
  "GST with trade discount on goods purchases and sales when trade discount is deducted before GST",
  "GST on fixed asset purchases: plus GST, GST-inclusive amount with GST rate, and CGST/SGST or IGST plus GST",
  "GST on selected expenses: legal charges, repairs, advertisement, freight, carriage, printing and stationery, telephone, internet, office expenses, and professional fees",
  "GST on selected income/service receipts: service income, consultancy fees, professional fees received, tuition fees, royalty, and rent",
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
  "Goods distributed as free sample for advertisement or promotion",
  "Goods given as charity or donation",
  "Goods lost by fire, theft, accident, or damage without insurance claim",
  "Sales Return / goods returned by customer",
  "Purchase Return / goods returned to supplier",
  "GST with simple sales return and purchase return without refund",
  "Simple direct GST set-off and GST payment through bank",
];

const unsupportedTransactions = [
  "GST inclusive amount without GST rate",
  "CGST/SGST/IGST inclusive amount without tax rate",
  "GST-inclusive CGST/SGST/IGST split for fixed assets",
  "GST refund from government",
  "Cross-utilisation beyond direct matching",
  "GST interest or penalty",
  "GSTR filing",
  "Complex GST ledger adjustment",
  "GST on salary, wages, rent, interest, or commission",
  "GST on interest, dividend, discount received, miscellaneous income, bad debts recovered, capital receipts, or loan receipts",
  "GST with full-settlement discount allowed or received",
  "GST-inclusive amount with trade discount",
  "Multiple discounts with GST",
  "GST-inclusive CGST/SGST/IGST on expenses",
  "GST-inclusive CGST/SGST/IGST on incomes",
  "GST on unsupported income categories",
  "GST on unsupported expenses",
  "Compound expense payments",
  "Compound income receipts",
  "Expense payments with discount or settlement",
  "Income receipts with discount or settlement beyond supported cases",
  "Installation charges with GST",
  "Asset purchase plus installation charges plus GST",
  "Asset purchase with installation paid using different modes",
  "Repairs or maintenance to assets as capitalization",
  "Asset purchases with partial payment and balance credit beyond supported simple cases",
  "GST on asset sales",
  "Asset sales with partial payment and balance credit",
  "Asset sale without cost or book value",
  "Asset sale without accumulated depreciation amount in disposal cases",
  "Multiple asset disposal",
  "Revaluation reserve",
  "Insurance claim on asset sale",
  "Provision-related discounts",
  "Broad settlement and ledger treatment beyond the journal entry",
  "Trade discount in invoice unless the wording matches supported trade-discount cases",
  "Insurance claim on goods lost by fire",
  "GST-inclusive returns",
  "Returns with cash or bank refund",
  "Returns with discount",
  "Returns with settlement",
  "Stock or inventory treatment for returns",
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
  "Paid wages Rs.5000 in cash",
  "Paid freight Rs.2000 through bank",
  "Paid repairs Rs.1500 by UPI",
  "Paid telephone bill Rs.1000 in cash",
  "Paid internet bill Rs.1500 by UPI",
  "Paid legal charges Rs.5000 in cash",
  "Paid office expenses Rs.2500 through bank",
  "Received rent Rs.5000 in cash",
  "Received service income Rs.7000 through bank",
  "Received consultancy fees Rs.10000 by UPI",
  "Received tuition fees Rs.3000 in cash",
  "Received dividend Rs.2000 in cash",
  "Received royalty Rs.4000 through bank",
  "Bought laptop for cash Rs.30000",
  "Purchased printer through bank Rs.8000",
  "Bought camera from Amit on credit Rs.20000",
  "Purchased land through bank Rs.100000",
  "Bought vehicle on credit Rs.300000",
  "Purchased goods Rs.10000 plus GST 18% for cash",
  "Purchased goods from Amit Rs.10000 plus GST 18% on credit",
  "Sold goods Rs.10000 plus GST 18% for cash",
  "Sold goods to Raju Rs.10000 plus GST 18% on credit",
  "Purchased goods Rs.11800 including GST 18% for cash",
  "Purchased goods from Amit Rs.11800 including GST 18% on credit",
  "Sold goods Rs.11800 including GST 18% for cash",
  "Sold goods to Raju Rs.11800 including GST 18% on credit",
  "Purchased goods Rs.10000 plus CGST 9% and SGST 9% for cash",
  "Sold goods Rs.10000 plus CGST 9% and SGST 9% for cash",
  "Purchased goods Rs.10000 plus IGST 18% for cash",
  "Sold goods Rs.10000 plus IGST 18% for cash",
  "Purchased goods Rs.10000 less trade discount Rs.1000 plus GST 18% for cash",
  "Sold goods Rs.10000 less trade discount Rs.1000 plus GST 18% for cash",
  "Purchased goods Rs.10000 less trade discount 10% plus GST 18% for cash",
  "Sold goods Rs.10000 less trade discount Rs.1000 plus CGST 9% and SGST 9% for cash",
  "Purchased goods Rs.11800 including CGST 9% and SGST 9% for cash",
  "Sold goods Rs.11800 including CGST 9% and SGST 9% for cash",
  "Purchased goods Rs.11800 including IGST 18% for cash",
  "Sold goods Rs.11800 including IGST 18% for cash",
  "Purchased machinery Rs.50000 plus GST 18% for cash",
  "Bought laptop Rs.35400 including GST 18% by UPI",
  "Purchased machinery Rs.50000 plus CGST 9% and SGST 9% for cash",
  "Purchased machinery Rs.50000 plus IGST 18% for cash",
  "Paid legal charges Rs.10000 plus GST 18% through bank",
  "Paid repairs Rs.5000 plus GST 18% in cash",
  "Paid legal charges Rs.11800 including GST 18% through bank",
  "Paid advertisement Rs.3000 plus CGST 9% and SGST 9% by UPI",
  "Paid professional fees Rs.10000 plus IGST 18% through bank",
  "Received consultancy fees Rs.10000 plus GST 18% through bank",
  "Received service income Rs.10000 plus GST 18% in cash",
  "Received consultancy fees Rs.11800 including GST 18% through bank",
  "Received tuition fees Rs.5000 plus CGST 9% and SGST 9% by UPI",
  "Received royalty Rs.4000 plus IGST 18% in cash",
  "Paid installation charges on machinery Rs.5000 in cash",
  "Paid erection charges on machinery Rs.5000 through bank",
  "Paid setup charges on laptop Rs.1500 by UPI",
  "Paid fitting charges on printer Rs.1000 in cash",
  "Purchased machinery Rs.50000 and paid installation charges Rs.5000 in cash",
  "Bought laptop Rs.30000 and paid setup charges Rs.1500 by UPI",
  "Bought printer Rs.8000 and paid fitting charges Rs.1000 in cash",
  "Purchased machinery from Amit Rs.50000 plus installation charges Rs.5000 on credit",
  "Sold machinery Rs.40000 for cash",
  "Sold laptop Rs.20000 through bank",
  "Sold car to Raju Rs.250000 on credit",
  "Sold land through bank Rs.300000",
  "Sold machinery costing Rs.50000 for Rs.40000 cash",
  "Sold machinery costing Rs.50000 for Rs.60000 cash",
  "Sold laptop costing Rs.30000 for Rs.20000 through bank",
  "Sold car costing Rs.300000 to Raju for Rs.250000 on credit",
  "Sold machinery costing Rs.50000 with accumulated depreciation Rs.10000 for Rs.35000 cash",
  "Sold machinery costing Rs.50000 with accumulated depreciation Rs.10000 for Rs.45000 cash",
  "Sold laptop costing Rs.30000 with accumulated depreciation Rs.5000 for Rs.20000 through bank",
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
  "Goods worth Rs.1000 distributed as free sample",
  "Goods used for advertisement Rs.1500",
  "Goods worth Rs.2000 distributed for promotion",
  "Goods worth Rs.1000 given as charity",
  "Goods worth Rs.1500 donated to orphanage",
  "Goods used for charity Rs.2000",
  "Goods worth Rs.3000 lost by fire",
  "Goods worth Rs.2000 stolen",
  "Goods worth Rs.1000 lost",
  "Goods returned by Raju Rs.1000",
  "Goods returned by customer Rs.1000",
  "Sales return from Amit Rs.1500",
  "Goods returned to Amit Rs.1000",
  "Goods returned to supplier Rs.1000",
  "Purchase return to Rahul Rs.1500",
  "Goods returned by Raju Rs.1000 plus GST 18%",
  "Goods returned to Amit Rs.1000 plus GST 18%",
  "Goods returned by customer Rs.1000 plus CGST 9% and SGST 9%",
  "Goods returned to supplier Rs.1000 plus IGST 18%",
  "Set off Input GST Rs.5000 against Output GST Rs.8000",
  "Paid GST liability Rs.3000 through bank",
  "Set off Input CGST Rs.2500 and Input SGST Rs.2500 against Output CGST Rs.4000 and Output SGST Rs.4000",
  "Paid CGST Rs.1500 and SGST Rs.1500 through bank",
  "Set off Input IGST Rs.5000 against Output IGST Rs.8000",
  "Paid IGST Rs.3000 through bank",
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
