import { describe, expect, it } from "vitest";
import { generateExpectedEntry } from "@/lib/expected-entry-generator";
import { classifyTransaction, extractAmount } from "@/lib/transaction-classifier";

describe("extractAmount", () => {
  it.each([
    ["Started business with ₹50,000 cash", 50000],
    ["Paid rent Rs. 50,000", 50000],
    ["Received INR 50000 from debtor", 50000],
    ["Paid salary 50000", 50000],
    ["Sold goods for cash 50,000", 50000],
    ["Bought goods for cash 50k", 50000],
    ["Paid creditor 50000/-", 50000],
    ["Paid electricity bill ₹ 5,000.00", 5000],
    ["Purchase goods worth Rs.5000 for cash", 5000],
    ["Purchase goods worth Rs. 5000 for cash", 5000],
    ["Purchase goods worth ₹5000 for cash", 5000],
    ["Purchase goods worth 5000 for cash", 5000],
    ["Purchase goods worth Rs.5,000 for cash", 5000],
  ])("extracts amount from %s", (transaction, expectedAmount) => {
    expect(extractAmount(transaction)).toBe(expectedAmount);
  });
});

describe("classifyTransaction supported beginner transactions", () => {
  it.each([
    ["Started business with ₹50,000 cash", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Commenced business with Rs. 70,000 cash", "capital_introduced_cash", "Cash", "Capital", 70000],
    ["Owner invest Rs.50000 cash into business", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner invests Rs.50000 cash into business", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner invested Rs.50000 cash into business", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner introduced Rs.50000 cash into business", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner introduced capital Rs.50000 in cash", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Capital introduced Rs.50000 in cash", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Capital introduced by owner Rs.50000 in cash", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Started business with cash Rs.50000", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Started business with Rs.50000 cash", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner deposited Rs.50000 into business as capital", "capital_introduced_cash", "Cash", "Capital", 50000],
    ["Owner invested INR 90000 in bank", "started_business_bank", "Bank", "Capital", 90000],
    ["Started business with bank Rs.50000", "started_business_bank", "Bank", "Capital", 50000],
    ["Started business with ₹80,000 in bank", "started_business_bank", "Bank", "Capital", 80000],
    ["Bought goods for cash ₹12,000", "bought_goods_cash", "Purchases", "Cash", 12000],
    ["Cash purchases ₹15,000", "bought_goods_cash", "Purchases", "Cash", 15000],
    ["Purchase goods worth Rs.5000 for cash.", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Purchased goods worth Rs.5000 for cash", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Purchases goods worth Rs.5000 for cash", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Bought goods worth Rs.5000 for cash", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Bought goods for Rs.5000 cash", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Purchased goods for cash Rs.5000", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Goods purchased for cash Rs.5000", "bought_goods_cash", "Purchases", "Cash", 5000],
    ["Purchase goods from Kuldeep for cash Rs. 500", "bought_goods_cash", "Purchases", "Cash", 500],
    ["Bought goods from Rahul for cash Rs. 1000", "bought_goods_cash", "Purchases", "Cash", 1000],
    ["Purchased goods Rs.3000", "assumed_cash_goods_purchase", "Purchases", "Cash", 3000],
    ["Bought goods Rs.3000", "assumed_cash_goods_purchase", "Purchases", "Cash", 3000],
    ["Purchase goods Rs.3000", "assumed_cash_goods_purchase", "Purchases", "Cash", 3000],
    ["Goods purchased Rs.3000", "assumed_cash_goods_purchase", "Purchases", "Cash", 3000],
    ["Bought mangoes Rs.500", "assumed_cash_goods_purchase", "Purchases", "Cash", 500],
    ["Purchased rice Rs.1000", "assumed_cash_goods_purchase", "Purchases", "Cash", 1000],
    ["Bought apples Rs.700", "assumed_cash_goods_purchase", "Purchases", "Cash", 700],
    ["Purchase mangoes from seller for cash Rs. 500", "named_goods_purchase_cash", "Purchases", "Cash", 500],
    [
      "Goods worth Rs.1000 purchased for cash Rs.900 after discount Rs.100",
      "trade_discount_cash_purchase",
      "Purchases",
      "Cash",
      900,
    ],
    [
      "Purchased goods worth Rs.1000 for cash Rs.900 after discount Rs.100",
      "trade_discount_cash_purchase",
      "Purchases",
      "Cash",
      900,
    ],
    [
      "Bought goods worth Rs.1000 for cash Rs.900 after discount Rs.100",
      "trade_discount_cash_purchase",
      "Purchases",
      "Cash",
      900,
    ],
    ["Bought goods on credit ₹18,000", "bought_goods_credit", "Purchases", "Creditor", 18000],
    ["Purchased goods from supplier Rs. 22,000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 22000],
    ["Purchased goods from Kuldeep Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Kuldeep", 3000],
    ["Bought goods from Raju Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Raju", 3000],
    ["Goods purchased from Amit Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Amit", 3000],
    ["Bought mangoes from seller Rs.500", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 500],
    ["Purchased rice from supplier Rs.1000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 1000],
    ["Purchase goods from Kuldeep on credit Rs. 500", "named_goods_purchase_credit", "Purchases", "Kuldeep", 500],
    ["Purchase mangoes from seller on credit Rs. 500", "named_goods_purchase_credit", "Purchases", "Creditor", 500],
    [
      "Goods worth Rs.1000 purchased from Raju for Rs.900 after discount Rs.100",
      "trade_discount_credit_purchase",
      "Purchases",
      "Creditor",
      900,
    ],
    [
      "Purchased goods worth Rs.1000 from Raju for Rs.900 after discount Rs.100",
      "trade_discount_credit_purchase",
      "Purchases",
      "Creditor",
      900,
    ],
    [
      "Bought goods worth Rs.1000 from supplier for Rs.900 after discount Rs.100",
      "trade_discount_credit_purchase",
      "Purchases",
      "Creditor",
      900,
    ],
    ["Purchase machinery from Kuldeep for cash Rs. 500", "asset_purchase_machinery_cash", "Machinery", "Cash", 500],
    ["Purchased machinery from Kuldeep for cash Rs. 500", "asset_purchase_machinery_cash", "Machinery", "Cash", 500],
    ["Bought machinery from Rahul for cash Rs. 1000", "asset_purchase_machinery_cash", "Machinery", "Cash", 1000],
    ["Purchase furniture from Amit for cash Rs. 2000", "asset_purchase_furniture_cash", "Furniture", "Cash", 2000],
    ["Bought furniture from seller for cash Rs. 2000", "asset_purchase_furniture_cash", "Furniture", "Cash", 2000],
    ["Bought table from Raju for cash Rs.1000", "asset_purchase_furniture_cash", "Furniture", "Cash", 1000],
    ["Purchase table from Raju for cash Rs.1000", "asset_purchase_furniture_cash", "Furniture", "Cash", 1000],
    ["Purchased chair from Amit for cash Rs.2000", "asset_purchase_furniture_cash", "Furniture", "Cash", 2000],
    ["Bought office table from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Bought chairs from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Purchase desk from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Purchase almirah from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Purchase cupboard from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Purchase bookshelf from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Bought office chair from seller for cash Rs.3000", "asset_purchase_furniture_cash", "Furniture", "Cash", 3000],
    ["Purchase computer from Amit for cash Rs. 2000", "asset_purchase_computer_cash", "Computer", "Cash", 2000],
    ["Purchase vehicle from Amit for cash Rs. 2000", "asset_purchase_vehicle_cash", "Vehicle", "Cash", 2000],
    ["Purchase equipment from Amit for cash Rs. 2000", "asset_purchase_equipment_cash", "Equipment", "Cash", 2000],
    ["Bought laptop for cash Rs.30000", "asset_purchase_laptop_cash", "Computer", "Cash", 30000],
    ["Purchased printer through bank Rs.8000", "asset_purchase_printer_bank", "Equipment", "Bank", 8000],
    ["Bought mobile phone for office Rs.15000 in cash", "asset_purchase_mobile_phone_cash", "Equipment", "Cash", 15000],
    ["Bought office equipment from Rahul on credit Rs.10000", "asset_purchase_office_equipment_credit", "Equipment", "Rahul", 10000],
    ["Bought tools for cash Rs.5000", "asset_purchase_tools_cash", "Equipment", "Cash", 5000],
    ["Purchased land through bank Rs.100000", "asset_purchase_land_bank", "Land", "Bank", 100000],
    ["Purchased building for cash Rs.500000", "asset_purchase_building_cash", "Building", "Cash", 500000],
    ["Purchased AC through bank Rs.25000", "asset_purchase_air_conditioner_bank", "Equipment", "Bank", 25000],
    ["Bought fan for office Rs.3000 in cash", "asset_purchase_fan_cash", "Equipment", "Cash", 3000],
    ["Bought camera from Amit on credit Rs.20000", "asset_purchase_camera_credit", "Equipment", "Amit", 20000],
    ["Purchased generator through bank Rs.30000", "asset_purchase_generator_bank", "Equipment", "Bank", 30000],
    ["Bought car from Amit on credit Rs.300000", "asset_purchase_vehicle_credit", "Vehicle", "Amit", 300000],
    ["Bad debts written off Rs.2000", "bad_debts_written_off", "Bad Debts", "Debtor", 2000],
    ["Bad debts Rs.2000 written off", "bad_debts_written_off", "Bad Debts", "Debtor", 2000],
    ["Bad debt written off Rs.2000", "bad_debts_written_off", "Bad Debts", "Debtor", 2000],
    ["Debtor became bad debt Rs.2000", "bad_debts_written_off", "Bad Debts", "Debtor", 2000],
    ["Amount due from debtor written off Rs.2000", "bad_debts_written_off", "Bad Debts", "Debtor", 2000],
    ["Raju became insolvent and Rs.1000 became bad debt", "bad_debts_named_written_off", "Bad Debts", "Raju", 1000],
    [
      "Raju became insolvent, Rs.1000 written off as bad debt",
      "bad_debts_named_written_off",
      "Bad Debts",
      "Raju",
      1000,
    ],
    ["Bad debt written off from Raju Rs.1000", "bad_debts_named_written_off", "Bad Debts", "Raju", 1000],
    ["Raju’s debt written off Rs.1000", "bad_debts_named_written_off", "Bad Debts", "Raju", 1000],
    ["Amount due from Raju written off Rs.1000", "bad_debts_named_written_off", "Bad Debts", "Raju", 1000],
    [
      "Raju could not pay Rs.1000, written off as bad debt",
      "bad_debts_named_written_off",
      "Bad Debts",
      "Raju",
      1000,
    ],
    ["Raju declared insolvent, Rs.1000 written off", "bad_debts_named_written_off", "Bad Debts", "Raju", 1000],
    ["Bad debts recovered Rs.500 in cash", "bad_debts_recovered_cash", "Cash", "Bad Debts Recovered", 500],
    ["Bad debt recovered Rs.500 in cash", "bad_debts_recovered_cash", "Cash", "Bad Debts Recovered", 500],
    ["Recovered bad debts Rs.500 in cash", "bad_debts_recovered_cash", "Cash", "Bad Debts Recovered", 500],
    ["Recovered bad debt Rs.500 in cash", "bad_debts_recovered_cash", "Cash", "Bad Debts Recovered", 500],
    ["Cash received for bad debts recovered Rs.500", "bad_debts_recovered_cash", "Cash", "Bad Debts Recovered", 500],
    [
      "Previously written off bad debt recovered Rs.500 in cash",
      "bad_debts_recovered_cash",
      "Cash",
      "Bad Debts Recovered",
      500,
    ],
    [
      "Bad debts recovered from Raju Rs.500 in cash",
      "bad_debts_recovered_cash",
      "Cash",
      "Bad Debts Recovered",
      500,
    ],
    [
      "Raju paid Rs.500 against bad debts previously written off",
      "bad_debts_recovered_cash",
      "Cash",
      "Bad Debts Recovered",
      500,
    ],
    ["Bad debts recovered Rs.500 through bank", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    ["Bad debt recovered Rs.500 through bank", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    ["Recovered bad debts Rs.500 through bank", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    ["Bad debts recovered Rs.500 by UPI", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    ["Bad debts recovered Rs.500 through GPay", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    ["Bad debts recovered Rs.500 by NEFT", "bad_debts_recovered_bank", "Bank", "Bad Debts Recovered", 500],
    [
      "Previously written off bad debt recovered Rs.500 through bank",
      "bad_debts_recovered_bank",
      "Bank",
      "Bad Debts Recovered",
      500,
    ],
    [
      "Bad debts recovered from Raju Rs.500 through bank",
      "bad_debts_recovered_bank",
      "Bank",
      "Bad Debts Recovered",
      500,
    ],
    ["Salary outstanding Rs.6000", "outstanding_salary", "Salary Expense", "Outstanding Salary", 6000],
    ["Outstanding salary Rs.6000", "outstanding_salary", "Salary Expense", "Outstanding Salary", 6000],
    ["Salary due but not paid Rs.6000", "outstanding_salary", "Salary Expense", "Outstanding Salary", 6000],
    ["Salary payable Rs.6000", "outstanding_salary", "Salary Expense", "Outstanding Salary", 6000],
    ["Salary expense outstanding Rs.6000", "outstanding_salary", "Salary Expense", "Outstanding Salary", 6000],
    ["Rent outstanding Rs.5000", "outstanding_rent", "Rent Expense", "Outstanding Rent", 5000],
    ["Outstanding rent Rs.5000", "outstanding_rent", "Rent Expense", "Outstanding Rent", 5000],
    ["Rent due but not paid Rs.5000", "outstanding_rent", "Rent Expense", "Outstanding Rent", 5000],
    ["Rent payable Rs.5000", "outstanding_rent", "Rent Expense", "Outstanding Rent", 5000],
    ["Rent expense outstanding Rs.5000", "outstanding_rent", "Rent Expense", "Outstanding Rent", 5000],
    ["Wages outstanding Rs.4000", "outstanding_wages", "Wages Expense", "Outstanding Wages", 4000],
    ["Outstanding wages Rs.4000", "outstanding_wages", "Wages Expense", "Outstanding Wages", 4000],
    ["Wages due but not paid Rs.4000", "outstanding_wages", "Wages Expense", "Outstanding Wages", 4000],
    ["Wages payable Rs.4000", "outstanding_wages", "Wages Expense", "Outstanding Wages", 4000],
    [
      "Electricity bill outstanding Rs.2000",
      "outstanding_electricity",
      "Electricity Expense",
      "Outstanding Electricity",
      2000,
    ],
    [
      "Electricity outstanding Rs.2000",
      "outstanding_electricity",
      "Electricity Expense",
      "Outstanding Electricity",
      2000,
    ],
    [
      "Outstanding electricity bill Rs.2000",
      "outstanding_electricity",
      "Electricity Expense",
      "Outstanding Electricity",
      2000,
    ],
    [
      "Electricity expense outstanding Rs.2000",
      "outstanding_electricity",
      "Electricity Expense",
      "Outstanding Electricity",
      2000,
    ],
    [
      "Electricity payable Rs.2000",
      "outstanding_electricity",
      "Electricity Expense",
      "Outstanding Electricity",
      2000,
    ],
    ["Insurance outstanding Rs.3000", "outstanding_insurance", "Insurance Expense", "Outstanding Insurance", 3000],
    ["Outstanding insurance Rs.3000", "outstanding_insurance", "Insurance Expense", "Outstanding Insurance", 3000],
    [
      "Insurance premium outstanding Rs.3000",
      "outstanding_insurance",
      "Insurance Expense",
      "Outstanding Insurance",
      3000,
    ],
    ["Insurance payable Rs.3000", "outstanding_insurance", "Insurance Expense", "Outstanding Insurance", 3000],
    ["Prepaid rent Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Rent prepaid Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Rent paid in advance Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Rent paid beforehand Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Advance rent Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Rent expense prepaid Rs.5000", "prepaid_rent", "Prepaid Rent", "Rent Expense", 5000],
    ["Prepaid insurance Rs.3000", "prepaid_insurance", "Prepaid Insurance", "Insurance Expense", 3000],
    ["Insurance prepaid Rs.3000", "prepaid_insurance", "Prepaid Insurance", "Insurance Expense", 3000],
    [
      "Insurance paid in advance Rs.3000",
      "prepaid_insurance",
      "Prepaid Insurance",
      "Insurance Expense",
      3000,
    ],
    [
      "Insurance premium prepaid Rs.3000",
      "prepaid_insurance",
      "Prepaid Insurance",
      "Insurance Expense",
      3000,
    ],
    ["Advance insurance Rs.3000", "prepaid_insurance", "Prepaid Insurance", "Insurance Expense", 3000],
    [
      "Insurance expense prepaid Rs.3000",
      "prepaid_insurance",
      "Prepaid Insurance",
      "Insurance Expense",
      3000,
    ],
    ["Prepaid salary Rs.6000", "prepaid_salary", "Prepaid Salary", "Salary Expense", 6000],
    ["Salary prepaid Rs.6000", "prepaid_salary", "Prepaid Salary", "Salary Expense", 6000],
    ["Salary paid in advance Rs.6000", "prepaid_salary", "Prepaid Salary", "Salary Expense", 6000],
    ["Advance salary Rs.6000", "prepaid_salary", "Prepaid Salary", "Salary Expense", 6000],
    ["Salary expense prepaid Rs.6000", "prepaid_salary", "Prepaid Salary", "Salary Expense", 6000],
    ["Prepaid wages Rs.4000", "prepaid_wages", "Prepaid Wages", "Wages Expense", 4000],
    ["Wages prepaid Rs.4000", "prepaid_wages", "Prepaid Wages", "Wages Expense", 4000],
    ["Wages paid in advance Rs.4000", "prepaid_wages", "Prepaid Wages", "Wages Expense", 4000],
    ["Advance wages Rs.4000", "prepaid_wages", "Prepaid Wages", "Wages Expense", 4000],
    ["Wages expense prepaid Rs.4000", "prepaid_wages", "Prepaid Wages", "Wages Expense", 4000],
    ["Prepaid electricity Rs.2000", "prepaid_electricity", "Prepaid Electricity", "Electricity Expense", 2000],
    ["Electricity prepaid Rs.2000", "prepaid_electricity", "Prepaid Electricity", "Electricity Expense", 2000],
    [
      "Electricity bill paid in advance Rs.2000",
      "prepaid_electricity",
      "Prepaid Electricity",
      "Electricity Expense",
      2000,
    ],
    ["Advance electricity Rs.2000", "prepaid_electricity", "Prepaid Electricity", "Electricity Expense", 2000],
    [
      "Electricity expense prepaid Rs.2000",
      "prepaid_electricity",
      "Prepaid Electricity",
      "Electricity Expense",
      2000,
    ],
    ["Interest accrued Rs.1500", "accrued_interest", "Accrued Interest", "Interest Income", 1500],
    ["Accrued interest Rs.1500", "accrued_interest", "Accrued Interest", "Interest Income", 1500],
    [
      "Interest earned but not received Rs.1500",
      "accrued_interest",
      "Accrued Interest",
      "Interest Income",
      1500,
    ],
    ["Interest income accrued Rs.1500", "accrued_interest", "Accrued Interest", "Interest Income", 1500],
    ["Interest receivable Rs.1500", "accrued_interest", "Accrued Interest", "Interest Income", 1500],
    [
      "Interest due but not received Rs.1500",
      "accrued_interest",
      "Accrued Interest",
      "Interest Income",
      1500,
    ],
    ["Commission accrued Rs.3000", "accrued_commission", "Accrued Commission", "Commission Income", 3000],
    ["Accrued commission Rs.3000", "accrued_commission", "Accrued Commission", "Commission Income", 3000],
    [
      "Commission earned but not received Rs.3000",
      "accrued_commission",
      "Accrued Commission",
      "Commission Income",
      3000,
    ],
    [
      "Commission income accrued Rs.3000",
      "accrued_commission",
      "Accrued Commission",
      "Commission Income",
      3000,
    ],
    ["Commission receivable Rs.3000", "accrued_commission", "Accrued Commission", "Commission Income", 3000],
    [
      "Commission due but not received Rs.3000",
      "accrued_commission",
      "Accrued Commission",
      "Commission Income",
      3000,
    ],
    ["Rent accrued Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Accrued rent Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Rent earned but not received Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Rent income accrued Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Rent receivable Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Rent due but not received Rs.4000", "accrued_rent", "Accrued Rent", "Rent Income", 4000],
    ["Rent received in advance Rs.4000", "rent_received_in_advance", "Rent Income", "Rent Received in Advance", 4000],
    ["Advance rent received Rs.4000", "rent_received_in_advance", "Rent Income", "Rent Received in Advance", 4000],
    [
      "Rent income received in advance Rs.4000",
      "rent_received_in_advance",
      "Rent Income",
      "Rent Received in Advance",
      4000,
    ],
    ["Rent received beforehand Rs.4000", "rent_received_in_advance", "Rent Income", "Rent Received in Advance", 4000],
    [
      "Rent received but not earned Rs.4000",
      "rent_received_in_advance",
      "Rent Income",
      "Rent Received in Advance",
      4000,
    ],
    ["Unearned rent Rs.4000", "rent_received_in_advance", "Rent Income", "Rent Received in Advance", 4000],
    [
      "Commission received in advance Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Advance commission received Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Commission income received in advance Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Commission received beforehand Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Commission received but not earned Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Unearned commission Rs.3000",
      "commission_received_in_advance",
      "Commission Income",
      "Commission Received in Advance",
      3000,
    ],
    [
      "Interest received in advance Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Advance interest received Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Interest income received in advance Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Interest received beforehand Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Interest received but not earned Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Unearned interest Rs.1500",
      "interest_received_in_advance",
      "Interest Income",
      "Interest Received in Advance",
      1500,
    ],
    [
      "Received Rs.9500 from Mohan in full settlement of Rs.10000",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Received cash Rs.9500 from Mohan in full settlement of Rs.10000",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Mohan paid Rs.9500 in full settlement of Rs.10000",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Received Rs.9500 from debtor in full settlement of Rs.10000",
      "discount_allowed_cash_settlement",
      "Cash",
      "Debtor",
      10000,
    ],
    [
      "Received Rs.9500 from Mohan and allowed discount Rs.500",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Received cash Rs.9500 from Mohan after allowing discount Rs.500",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Mohan settled account of Rs.10000 by paying Rs.9500",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Received Rs.9500 from Mohan as full and final settlement of Rs.10000",
      "discount_allowed_cash_settlement",
      "Cash",
      "Mohan",
      10000,
    ],
    [
      "Received Rs.9500 from Mohan through bank in full settlement of Rs.10000",
      "discount_allowed_bank_settlement",
      "Bank",
      "Mohan",
      10000,
    ],
    [
      "Mohan paid Rs.9500 by GPay in full settlement of Rs.10000",
      "discount_allowed_bank_settlement",
      "Bank",
      "Mohan",
      10000,
    ],
    [
      "Received Rs.9500 from debtor through bank and allowed discount Rs.500",
      "discount_allowed_bank_settlement",
      "Bank",
      "Debtor",
      10000,
    ],
    [
      "Paid Rs.4500 to Ram in full settlement of Rs.5000",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Paid cash Rs.4500 to Ram in full settlement of Rs.5000",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Paid Rs.4500 to creditor in full settlement of Rs.5000",
      "discount_received_cash_settlement",
      "Creditor",
      "Cash",
      5000,
    ],
    [
      "Paid Rs.4500 to Ram and received discount Rs.500",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Paid cash Rs.4500 to Ram after receiving discount Rs.500",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Ram accepted Rs.4500 in full settlement of Rs.5000",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Settled Ram account of Rs.5000 by paying Rs.4500",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Paid Rs.4500 to Ram as full and final settlement of Rs.5000",
      "discount_received_cash_settlement",
      "Ram",
      "Cash",
      5000,
    ],
    [
      "Paid Rs.4500 to Ram through bank in full settlement of Rs.5000",
      "discount_received_bank_settlement",
      "Ram",
      "Bank",
      5000,
    ],
    [
      "Paid Rs.4500 to Ram by GPay and received discount Rs.500",
      "discount_received_bank_settlement",
      "Ram",
      "Bank",
      5000,
    ],
    [
      "Settled Ram account by paying Rs.4500 through bank against Rs.5000",
      "discount_received_bank_settlement",
      "Ram",
      "Bank",
      5000,
    ],
    ["Depreciation charged on machinery Rs.5000", "depreciation_machinery", "Depreciation", "Machinery", 5000],
    ["Depreciation provided on machinery Rs.5000", "depreciation_machinery", "Depreciation", "Machinery", 5000],
    ["Depreciation on machinery Rs.5000", "depreciation_machinery", "Depreciation", "Machinery", 5000],
    ["Machinery depreciated by Rs.5000", "depreciation_machinery", "Depreciation", "Machinery", 5000],
    ["Depreciation charged on furniture Rs.2000", "depreciation_furniture", "Depreciation", "Furniture", 2000],
    ["Depreciation provided on furniture Rs.2000", "depreciation_furniture", "Depreciation", "Furniture", 2000],
    ["Depreciation on furniture Rs.2000", "depreciation_furniture", "Depreciation", "Furniture", 2000],
    ["Furniture depreciated by Rs.2000", "depreciation_furniture", "Depreciation", "Furniture", 2000],
    ["Depreciation charged on computer Rs.3000", "depreciation_computer", "Depreciation", "Computer", 3000],
    ["Depreciation provided on equipment Rs.4000", "depreciation_equipment", "Depreciation", "Equipment", 4000],
    ["Depreciation charged on vehicle Rs.10000", "depreciation_vehicle", "Depreciation", "Vehicle", 10000],
    ["Purchase machinery from Kuldeep on credit Rs. 500", "asset_purchase_machinery_credit", "Machinery", "Kuldeep", 500],
    ["Purchased machinery from Kuldeep on credit Rs. 500", "asset_purchase_machinery_credit", "Machinery", "Kuldeep", 500],
    ["Bought machinery from Rahul on credit Rs. 1000", "asset_purchase_machinery_credit", "Machinery", "Rahul", 1000],
    ["Purchase furniture from Amit on credit Rs. 2000", "asset_purchase_furniture_credit", "Furniture", "Amit", 2000],
    ["Bought table from Raju on credit Rs.1000", "asset_purchase_furniture_credit", "Furniture", "Raju", 1000],
    ["Purchase table from Raju on credit Rs.1000", "asset_purchase_furniture_credit", "Furniture", "Raju", 1000],
    ["Purchased chair from Amit on credit Rs.2000", "asset_purchase_furniture_credit", "Furniture", "Amit", 2000],
    ["Bought office table from seller on credit Rs.3000", "asset_purchase_furniture_credit", "Furniture", "Creditor", 3000],
    ["Sold goods for cash ₹25,000", "sold_goods_cash", "Cash", "Sales", 25000],
    ["Cash sales INR 30,000", "sold_goods_cash", "Cash", "Sales", 30000],
    ["Sold goods worth Rs.8000 for cash", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Goods sold for cash Rs.8000", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Sale goods for cash Rs.8000", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Sold goods in cash Rs.8000", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Sold goods by cash Rs.8000", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Cash sales Rs.8000", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Goods sold worth Rs.8000 cash", "sold_goods_cash", "Cash", "Sales", 8000],
    ["Sold goods to Raju for cash Rs.5000", "sold_goods_cash", "Cash", "Sales", 5000],
    ["Sold goods to Raju through UPI Rs.5000", "sold_goods_bank", "Bank", "Sales", 5000],
    ["Sold goods Rs.5000", "assumed_cash_goods_sale", "Cash", "Sales", 5000],
    ["Sold goods for Rs.5000", "assumed_cash_goods_sale", "Cash", "Sales", 5000],
    ["Goods sold Rs.5000", "assumed_cash_goods_sale", "Cash", "Sales", 5000],
    ["Sale of goods Rs.5000", "assumed_cash_goods_sale", "Cash", "Sales", 5000],
    ["Sold mango Rs.500", "assumed_cash_goods_sale", "Cash", "Sales", 500],
    ["Sold mangoes Rs.500", "assumed_cash_goods_sale", "Cash", "Sales", 500],
    ["Sold apples Rs.700", "assumed_cash_goods_sale", "Cash", "Sales", 700],
    ["Sold rice Rs.1000", "assumed_cash_goods_sale", "Cash", "Sales", 1000],
    [
      "Goods worth Rs.1000 sold for cash Rs.900 after discount Rs.100",
      "trade_discount_cash_sale",
      "Cash",
      "Sales",
      900,
    ],
    [
      "Goods worth Rs.1000 sold in cash for Rs.900 after discount Rs.100",
      "trade_discount_cash_sale",
      "Cash",
      "Sales",
      900,
    ],
    [
      "Sold goods worth Rs.1000 for cash Rs.900 after discount Rs.100",
      "trade_discount_cash_sale",
      "Cash",
      "Sales",
      900,
    ],
    ["Sold goods on credit ₹35,000", "sold_goods_credit", "Debtor", "Sales", 35000],
    ["Sold goods to customer Rs. 38,000", "sold_goods_credit", "Debtor", "Sales", 38000],
    ["Sold goods worth Rs.8000 on credit", "sold_goods_credit", "Debtor", "Sales", 8000],
    ["Goods sold on credit Rs.8000", "sold_goods_credit", "Debtor", "Sales", 8000],
    ["Credit sales Rs.8000", "sold_goods_credit", "Debtor", "Sales", 8000],
    ["Sold goods to debtor Rs.8000", "sold_goods_credit", "Debtor", "Sales", 8000],
    ["Goods sold to debtor on credit Rs.8000", "sold_goods_credit", "Debtor", "Sales", 8000],
    [
      "Goods worth Rs.1000 sold to Raju for Rs.900 after discount Rs.100",
      "trade_discount_credit_sale",
      "Debtor",
      "Sales",
      900,
    ],
    [
      "Sold goods worth Rs.1000 to Raju for Rs.900 after discount Rs.100",
      "trade_discount_credit_sale",
      "Debtor",
      "Sales",
      900,
    ],
    [
      "Goods worth Rs.1000 sold to customer for Rs.900 after discount Rs.100",
      "trade_discount_credit_sale",
      "Debtor",
      "Sales",
      900,
    ],
    ["Sold Mango to Bidyut Rs. 500", "assumed_credit_named_goods_sale", "Bidyut", "Sales", 500],
    ["Sold apples to Rahul Rs. 700", "assumed_credit_named_goods_sale", "Rahul", "Sales", 700],
    ["Sold rice to Amit Rs. 1000", "assumed_credit_named_goods_sale", "Amit", "Sales", 1000],
    ["Sold goods to Bidyut Rs. 500", "assumed_credit_named_goods_sale", "Bidyut", "Sales", 500],
    ["Sold mangoes to customer Rs. 500", "assumed_credit_named_goods_sale", "Debtor", "Sales", 500],
    ["Goods sold to Rahul Rs. 700", "assumed_credit_named_goods_sale", "Rahul", "Sales", 700],
    ["Sold goods to Kuldeep Rs.5000", "assumed_credit_named_goods_sale", "Kuldeep", "Sales", 5000],
    ["Goods sold to Kuldeep Rs.5000", "assumed_credit_named_goods_sale", "Kuldeep", "Sales", 5000],
    ["Sale of goods to Amit Rs.1000", "assumed_credit_named_goods_sale", "Amit", "Sales", 1000],
    ["Paid rent ₹5,000 in cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Paid rent Rs.5000 in cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Rent paid Rs.5000 in cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Paid rent worth Rs.5000 by cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Paid rent Rs.5000 by cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Rent expense paid Rs.5000 in cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Paid shop rent Rs.5000 cash", "paid_rent", "Rent Expense", "Cash", 5000],
    ["Paid rent Rs.5000 through bank", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Rent paid Rs.5000 through bank", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Paid rent Rs.5000 by cheque", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Rent paid by cheque Rs.5000", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Paid shop rent Rs.5000 through bank", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Paid rent Rs.5000 by UPI", "paid_rent_bank", "Rent Expense", "Bank", 5000],
    ["Paid salary ₹6,000 in cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Paid salary Rs.6000 in cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Salary paid Rs.6000 in cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Paid salary worth Rs.6000 by cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Paid salaries Rs.6000 in cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Staff salary paid Rs.6000 cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Employee salary paid Rs.6000 in cash", "paid_salary", "Salary Expense", "Cash", 6000],
    ["Paid salary Rs.6000 through bank", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Salary paid Rs.6000 through bank", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Paid salary Rs.6000 by cheque", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Salary paid by cheque Rs.6000", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Staff salary paid Rs.6000 through bank", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Employee salary paid Rs.6000 through bank", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Paid salary Rs.6000 through Google Pay", "paid_salary_bank", "Salary Expense", "Bank", 6000],
    ["Paid wages Rs.5000 in cash", "paid_wages_cash", "Wages Expense", "Cash", 5000],
    ["Paid carriage Rs.1000 in cash", "paid_carriage_cash", "Carriage Expense", "Cash", 1000],
    ["Paid freight Rs.2000 through bank", "paid_freight_bank", "Freight Expense", "Bank", 2000],
    ["Paid advertisement Rs.3000 in cash", "paid_advertisement_cash", "Advertisement Expense", "Cash", 3000],
    ["Paid repairs Rs.1500 in cash", "paid_repairs_cash", "Repairs Expense", "Cash", 1500],
    [
      "Paid printing and stationery Rs.1200 in cash",
      "paid_printing_stationery_cash",
      "Printing and Stationery Expense",
      "Cash",
      1200,
    ],
    ["Paid telephone bill Rs.1000 in cash", "paid_telephone_cash", "Telephone Expense", "Cash", 1000],
    ["Paid internet bill Rs.1500 by UPI", "paid_internet_bank", "Internet Expense", "Bank", 1500],
    ["Paid travelling expenses Rs.2000 in cash", "paid_travelling_cash", "Travelling Expense", "Cash", 2000],
    ["Paid fuel expense Rs.3000 through bank", "paid_petrol_fuel_bank", "Petrol/Fuel Expense", "Bank", 3000],
    ["Paid legal charges Rs.5000 in cash", "paid_legal_charges_cash", "Legal Charges", "Cash", 5000],
    ["Paid office expenses Rs.2500 through bank", "paid_office_expenses_bank", "Office Expenses", "Bank", 2500],
    ["Received commission Rs.3000 in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Commission received Rs.3000 in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Commission income received Rs.3000 in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Received commission income Rs.3000 by cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Received Rs.3000 commission in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Cash received for commission Rs.3000", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Commission earned Rs.3000 in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Commission income earned Rs.3000 in cash", "commission_received_cash", "Cash", "Commission Income", 3000],
    ["Received commission Rs.3000 through bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Commission received Rs.3000 through bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Commission income received Rs.3000 in bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Received commission income Rs.3000 by cheque", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Received Rs.3000 commission through bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Bank received for commission Rs.3000", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Commission earned Rs.3000 through bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Commission income earned Rs.3000 through bank", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Received commission Rs.3000 through GPay", "commission_received_bank", "Bank", "Commission Income", 3000],
    ["Bought furniture for cash ₹12,500", "bought_furniture_cash", "Furniture", "Cash", 12500],
    ["Bought machinery by cheque ₹45,000", "bought_machinery_cheque", "Machinery", "Bank", 45000],
    ["Deposited cash into bank ₹10,000", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Deposited cash Rs.10000 into bank", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Cash deposited into bank Rs.10000", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Deposited Rs.10000 cash into bank", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Deposited Rs.10000 in bank", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Cash paid into bank Rs.10000", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Paid cash Rs.10000 into bank", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Cash deposited Rs.10000 in bank", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Deposited cash in bank Rs.10000", "deposited_cash_bank", "Bank", "Cash", 10000],
    ["Withdraw cash from bank ₹8,000", "withdrew_cash_bank", "Cash", "Bank", 8000],
    ["Withdraw cash Rs.5000 from bank", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Withdrawn cash Rs.5000 from bank", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Cash withdrawn from bank Rs.5000", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Withdrew Rs.5000 from bank for office use", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Cash withdrawn from bank for business Rs.5000", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Withdraw Rs.5000 from bank for business use", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Cash withdrawn Rs.5000 from bank for office", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Withdrew cash Rs.5000 from bank for business", "withdrew_cash_bank", "Cash", "Bank", 5000],
    ["Owner withdrew cash for personal use ₹3,000", "owner_drawings_cash", "Drawings", "Cash", 3000],
    ["Owner withdrew cash Rs.5000 for personal use", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Withdraw cash Rs.5000 for personal use", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Cash withdrawn by owner Rs.5000", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Owner withdrew Rs.5000 from business", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Proprietor withdrew cash Rs.5000", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Drawings made in cash Rs.5000", "owner_drawings_cash", "Drawings", "Cash", 5000],
    ["Owner withdrew Rs.5000 from bank for personal use", "owner_drawings_bank", "Drawings", "Bank", 5000],
    ["Proprietor withdrew Rs.5000 from bank", "owner_drawings_bank", "Drawings", "Bank", 5000],
    ["Drawings made through bank Rs.5000", "owner_drawings_bank", "Drawings", "Bank", 5000],
    ["Owner withdrew by cheque Rs.5000 for personal use", "owner_drawings_bank", "Drawings", "Bank", 5000],
    [
      "Goods worth Rs.2000 withdrawn by proprietor for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods worth Rs.2000 withdrawn by owner for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Proprietor withdrew goods worth Rs.2000 for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Owner withdrew goods worth Rs.2000 for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods Rs.2000 taken by proprietor for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods Rs.2000 taken by owner for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Proprietor took goods Rs.2000 for personal use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    ["Owner took goods Rs.1500 for personal use", "goods_withdrawn_personal_use", "Drawings", "Purchases", 1500],
    ["Goods withdrawn for personal use Rs.2000", "goods_withdrawn_personal_use", "Drawings", "Purchases", 2000],
    ["Goods taken for household use Rs.2000", "goods_withdrawn_personal_use", "Drawings", "Purchases", 2000],
    [
      "Goods taken by proprietor for household use Rs.2000",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods withdrawn by proprietor Rs.2000 for home use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods withdrawn by owner Rs.1000 for home use",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      1000,
    ],
    [
      "Proprietor used business goods for personal use Rs.2000",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Owner used business goods for personal use Rs.2000",
      "goods_withdrawn_personal_use",
      "Drawings",
      "Purchases",
      2000,
    ],
    [
      "Goods worth Rs.1000 distributed as free sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 distributed as free samples",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 distributed as free sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 given as free sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given as free sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given away as free sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 distributed for advertisement",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 distributed for advertisement",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 distributed for promotion",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given as promotional sample",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Free samples distributed Rs.1000",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Free sample goods distributed Rs.1000",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods used as free sample Rs.1000",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods used for advertisement Rs.1500",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1500,
    ],
    [
      "Goods used for promotion Rs.1000",
      "goods_distributed_free_sample",
      "Advertisement Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given as charity",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given to charity",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 given as charity",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 given to charity",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    ["Goods worth Rs.1000 donated", "goods_given_as_charity", "Charity Expense", "Purchases", 1000],
    ["Goods Rs.1000 donated", "goods_given_as_charity", "Charity Expense", "Purchases", 1000],
    [
      "Goods worth Rs.1000 donated to charity",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given as donation",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods Rs.1000 given as donation",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 donated to poor people",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given to poor people",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1000 given to orphanage",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    [
      "Goods worth Rs.1500 donated to orphanage",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1500,
    ],
    [
      "Goods worth Rs.1000 given for charity purpose",
      "goods_given_as_charity",
      "Charity Expense",
      "Purchases",
      1000,
    ],
    ["Goods used for charity Rs.1000", "goods_given_as_charity", "Charity Expense", "Purchases", 1000],
    ["Goods worth Rs.3000 lost by fire", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods Rs.3000 lost by fire", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods destroyed by fire Rs.3000", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods worth Rs.3000 destroyed by fire", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods damaged by fire Rs.3000", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods worth Rs.3000 damaged by fire", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods burnt by fire Rs.3000", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods worth Rs.3000 burnt in fire", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Fire destroyed goods worth Rs.3000", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods lost due to fire Rs.3000", "goods_lost_by_fire", "Loss by Fire", "Purchases", 3000],
    ["Goods worth Rs.2000 lost by theft", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods Rs.2000 lost by theft", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods stolen Rs.2000", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods worth Rs.2000 stolen", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods stolen by thief Rs.2000", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods worth Rs.2000 stolen by thief", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods lost due to theft Rs.2000", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Theft of goods Rs.2000", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods worth Rs.2000 theft", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods Rs.2000 stolen from business", "goods_lost_by_theft", "Loss by Theft", "Purchases", 2000],
    ["Goods lost Rs.1000", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods worth Rs.1000 lost", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods damaged Rs.1000", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods worth Rs.1000 damaged", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods lost due to accident Rs.1000", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods worth Rs.1000 lost due to accident", "goods_lost_general", "Goods Lost", "Purchases", 1000],
    ["Goods returned by Raju Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Goods worth Rs.1000 returned by Raju", "sales_return", "Sales Return", "Raju", 1000],
    ["Raju returned goods Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Raju returned goods worth Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Goods returned from Raju Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Goods worth Rs.1000 returned from Raju", "sales_return", "Sales Return", "Raju", 1000],
    ["Sales return from Raju Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Sales return by Raju Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Raju returned goods sold to him Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Raju returned goods previously sold Rs.1000", "sales_return", "Sales Return", "Raju", 1000],
    ["Goods returned by customer Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Goods returned by debtor Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Customer returned goods Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Debtor returned goods Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Goods returned from customer Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Goods returned from debtor Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Sales return Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Sales returns Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Sales return from customer Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Sales return from debtor Rs.1000", "sales_return", "Sales Return", "Debtor", 1000],
    ["Goods returned to Amit Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Goods worth Rs.1000 returned to Amit", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Returned goods to Amit Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Returned goods worth Rs.1000 to Amit", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Goods returned to supplier Amit Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Purchase return to Amit Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Purchase returns to Amit Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Goods returned to Amit from earlier purchase Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Goods purchased from Amit returned Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Amit accepted goods return Rs.1000", "purchase_return", "Amit", "Purchase Return", 1000],
    ["Goods returned to supplier Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Goods returned to creditor Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Returned goods to supplier Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Returned goods to creditor Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Purchase return Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Purchase returns Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Purchase return to supplier Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Purchase return to creditor Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Goods purchased returned Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Goods returned from purchase Rs.1000", "purchase_return", "Creditor", "Purchase Return", 1000],
    ["Paid creditor ₹11,000 in cash", "paid_creditor", "Creditor", "Cash", 11000],
    ["Paid cash Rs.7000 to creditor", "paid_creditor", "Creditor", "Cash", 7000],
    ["Paid Rs.7000 to creditor in cash", "paid_creditor", "Creditor", "Cash", 7000],
    ["Amount paid to creditor Rs.7000 in cash", "paid_creditor", "Creditor", "Cash", 7000],
    ["Paid creditor Rs.7000 cash", "paid_creditor", "Creditor", "Cash", 7000],
    ["Paid Rs.7000 to creditor through bank", "paid_creditor_bank", "Creditor", "Bank", 7000],
    ["Paid creditor Rs.7000 through bank", "paid_creditor_bank", "Creditor", "Bank", 7000],
    ["Amount paid to creditor Rs.7000 through bank", "paid_creditor_bank", "Creditor", "Bank", 7000],
    ["Paid creditor by cheque Rs.7000", "paid_creditor_bank", "Creditor", "Bank", 7000],
    ["Paid creditor Rs.7000 by PhonePe", "paid_creditor_bank", "Creditor", "Bank", 7000],
    ["Paid Rs.7000 to Amit through UPI", "paid_named_creditor_bank", "Amit", "Bank", 7000],
    ["Received from debtor ₹13,000 in cash", "received_from_debtor", "Cash", "Debtor", 13000],
    ["Received cash Rs.10000 from debtor", "received_from_debtor", "Cash", "Debtor", 10000],
    ["Received Rs.10000 from debtor in cash", "received_from_debtor", "Cash", "Debtor", 10000],
    ["Debtor paid Rs.10000 in cash", "received_from_debtor", "Cash", "Debtor", 10000],
    ["Cash received from debtor Rs.10000", "received_from_debtor", "Cash", "Debtor", 10000],
    ["Amount received from debtor Rs.10000 in cash", "received_from_debtor", "Cash", "Debtor", 10000],
    ["Received Rs.10000 from debtor through bank", "received_from_debtor_bank", "Bank", "Debtor", 10000],
    ["Debtor paid Rs.10000 through bank", "received_from_debtor_bank", "Bank", "Debtor", 10000],
    ["Amount received from debtor Rs.10000 through bank", "received_from_debtor_bank", "Bank", "Debtor", 10000],
    ["Received from debtor by cheque Rs.10000", "received_from_debtor_bank", "Bank", "Debtor", 10000],
    ["Received from debtor by online transfer Rs.10000", "received_from_debtor_bank", "Bank", "Debtor", 10000],
    ["Received cash Rs.10000 from Raju", "received_from_named_debtor", "Cash", "Raju", 10000],
    ["Took loan Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Loan taken Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Received loan Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Borrowed Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Took bank loan Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Loan received Rs.50000 in cash", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Cash received as loan Rs.50000", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Borrowed cash Rs.50000 as loan", "loan_taken_cash", "Cash", "Loan", 50000],
    ["Took loan Rs.50000 through bank", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Loan taken Rs.50000 through bank", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Received loan Rs.50000 in bank", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Bank loan received Rs.50000", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Loan amount received through bank Rs.50000", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Loan received Rs.50000 through bank", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Borrowed Rs.50000 through bank", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Bank loan credited Rs.50000", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Took loan from bank ₹100,000", "loan_taken_bank", "Bank", "Loan", 100000],
    ["Took loan Rs.50000 through bank transfer", "loan_taken_bank", "Bank", "Loan", 50000],
    ["Repaid loan Rs.10000 in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Loan repaid Rs.10000 in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Paid loan Rs.10000 in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Loan repayment Rs.10000 by cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Paid Rs.10000 towards loan in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Cash paid for loan repayment Rs.10000", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Loan amount paid Rs.10000 in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Paid bank loan Rs.10000 in cash", "loan_repaid_cash", "Loan", "Cash", 10000],
    ["Repaid loan Rs.10000 through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Loan repaid Rs.10000 through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Paid loan Rs.10000 by cheque", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Loan repayment Rs.10000 through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Paid Rs.10000 towards loan through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Bank paid for loan repayment Rs.10000", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Loan amount paid Rs.10000 through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Paid bank loan Rs.10000 through bank", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Repaid loan Rs.10000 by net banking", "loan_repaid_bank", "Loan", "Bank", 10000],
    ["Paid interest Rs.2000 in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Interest paid Rs.2000 in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Paid interest expense Rs.2000 by cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Interest on loan paid Rs.2000 in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Paid Rs.2000 interest in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Cash paid for interest Rs.2000", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Interest expense paid Rs.2000 in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Paid loan interest Rs.2000 in cash", "interest_paid_cash", "Interest Expense", "Cash", 2000],
    ["Paid interest Rs.2000 through bank", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Interest paid Rs.2000 through bank", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Paid interest Rs.2000 by cheque", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Interest on loan paid Rs.2000 through bank", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Paid Rs.2000 interest through bank", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Bank paid for interest Rs.2000", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Interest expense paid Rs.2000 through bank", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Paid loan interest Rs.2000 by cheque", "interest_paid_bank", "Interest Expense", "Bank", 2000],
    ["Received interest Rs.1500 in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Interest received Rs.1500 in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Interest income received Rs.1500 in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Received interest income Rs.1500 by cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Received Rs.1500 interest in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Cash received for interest Rs.1500", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Interest earned Rs.1500 in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Interest income earned Rs.1500 in cash", "interest_received_cash", "Cash", "Interest Income", 1500],
    ["Received interest Rs.1500 through bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Interest received Rs.1500 through bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Interest income received Rs.1500 in bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Received interest income Rs.1500 by cheque", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Received Rs.1500 interest through bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Bank received for interest Rs.1500", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Interest earned Rs.1500 through bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Interest income earned Rs.1500 through bank", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Received interest Rs.1500 by NEFT", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Received rent Rs.5000 in cash", "rent_received_cash", "Cash", "Rent Income", 5000],
    ["Received service income Rs.7000 through bank", "service_income_received_bank", "Bank", "Service Income", 7000],
    [
      "Received consultancy fees Rs.10000 by UPI",
      "consultancy_income_received_bank",
      "Bank",
      "Consultancy Income",
      10000,
    ],
    ["Received tuition fees Rs.3000 in cash", "tuition_income_received_cash", "Cash", "Tuition Income", 3000],
    ["Received dividend Rs.2000 in cash", "dividend_income_received_cash", "Cash", "Dividend Income", 2000],
    ["Received royalty Rs.4000 through bank", "royalty_income_received_bank", "Bank", "Royalty Income", 4000],
    ["Received interest income Rs.1500 by UPI", "interest_received_bank", "Bank", "Interest Income", 1500],
    ["Received commission income Rs.2500 by UPI", "commission_received_bank", "Bank", "Commission Income", 2500],
    ["Discount received Rs.500 in cash", "discount_received_cash", "Cash", "Discount Received", 500],
    [
      "Received miscellaneous income Rs.1000 in cash",
      "miscellaneous_income_received_cash",
      "Cash",
      "Miscellaneous Income",
      1000,
    ],
    ["Paid electricity bill ₹4,500", "paid_electricity", "Electricity Expense", "Cash", 4500],
  ])(
    "classifies %s",
    (transaction, transactionType, expectedDebit, expectedCredit, expectedAmount) => {
      const classification = classifyTransaction(transaction);

      expect(classification).toMatchObject({
        transaction_type: transactionType,
        debitAccount: expectedDebit,
        creditAccount: expectedCredit,
        expectedDebitAccount: expectedDebit,
        expectedCreditAccount: expectedCredit,
        amount: expectedAmount,
      });
      expect(classification?.confidence).toBeGreaterThanOrEqual(0.7);
    },
  );

  it.each([
    [
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Creditor",
    ],
    [
      "Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Creditor",
    ],
    [
      "Bought goods worth Rs.10000, paid Rs.4000 in cash and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Creditor",
    ],
    [
      "Purchased goods worth Rs.10000, paid Rs.4000 by cash and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Creditor",
    ],
    [
      "Bought goods Rs.10000, paid cash Rs.4000 and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Creditor",
    ],
    [
      "Purchased goods Rs.10000, paid Rs.4000 through bank and balance on credit",
      "partial_goods_purchase_bank_credit",
      "Bank",
      "Creditor",
    ],
    [
      "Bought goods Rs.10000, paid Rs.4000 by UPI and balance on credit",
      "partial_goods_purchase_bank_credit",
      "Bank",
      "Creditor",
    ],
    [
      "Purchased goods from Amit Rs.10000, paid Rs.4000 cash and balance on credit",
      "partial_goods_purchase_cash_credit",
      "Cash",
      "Amit",
    ],
  ])(
    "classifies partial goods purchase wording: %s",
    (transaction, transactionType, paymentAccount, creditorAccount) => {
      const classification = classifyTransaction(transaction);

      expect(classification).toMatchObject({
        transaction_type: transactionType,
        debitAccount: "Purchases",
        creditAccount: paymentAccount,
        expectedDebitAccount: "Purchases",
        expectedCreditAccount: paymentAccount,
        amount: 10000,
        confidence: 0.95,
      });

      const expectedEntry = generateExpectedEntry(classification!);
      expect(expectedEntry.debits).toEqual([{ account: "Purchases", amount: 10000 }]);
      expect(expectedEntry.credits[0]).toEqual({ account: paymentAccount, amount: 4000 });
      expect(expectedEntry.credits[1]).toMatchObject({ account: creditorAccount, amount: 6000 });

      if (creditorAccount === "Amit") {
        expect(expectedEntry.credits[1].acceptedAccounts).toEqual(["Creditor"]);
      }
    },
  );

  it.each([
    [
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
      "partial_goods_sale_cash_credit",
      "Cash",
      "Debtor",
    ],
    [
      "Sold goods Rs.10000, received Rs.4000 through bank and balance on credit",
      "partial_goods_sale_bank_credit",
      "Bank",
      "Debtor",
    ],
    [
      "Sold goods Rs.10000, received Rs.4000 by UPI and balance on credit",
      "partial_goods_sale_bank_credit",
      "Bank",
      "Debtor",
    ],
    [
      "Sold goods to Raju Rs.10000, received Rs.4000 cash and balance on credit",
      "partial_goods_sale_cash_credit",
      "Cash",
      "Raju",
    ],
  ])(
    "classifies partial goods sale wording: %s",
    (transaction, transactionType, receiptAccount, debtorAccount) => {
      const classification = classifyTransaction(transaction);

      expect(classification).toMatchObject({
        transaction_type: transactionType,
        debitAccount: receiptAccount,
        creditAccount: "Sales",
        expectedDebitAccount: receiptAccount,
        expectedCreditAccount: "Sales",
        amount: 10000,
        confidence: 0.95,
      });

      const expectedEntry = generateExpectedEntry(classification!);
      expect(expectedEntry.debits[0]).toEqual({ account: receiptAccount, amount: 4000 });
      expect(expectedEntry.debits[1]).toMatchObject({ account: debtorAccount, amount: 6000 });
      expect(expectedEntry.credits).toEqual([{ account: "Sales", amount: 10000 }]);

      if (debtorAccount === "Raju") {
        expect(expectedEntry.debits[1].acceptedAccounts).toEqual(["Debtor"]);
      }
    },
  );

  it("does not fall back to simple rules for unsupported partial compound wording", () => {
    expect(classifyTransaction("Bought machinery Rs.10000, paid Rs.4000 cash and balance on credit")).toBeNull();
    expect(classifyTransaction("Paid rent Rs.10000, paid Rs.4000 cash and balance on credit")).toBeNull();
    expect(classifyTransaction("Bought goods Rs.10000, paid Rs.4000 and balance on credit")).toBeNull();
  });

  it.each([
    ["Purchased goods Rs.10000 plus GST 18% for cash", "goods_gst_purchase_cash", "Purchases", "Cash"],
    ["Purchased goods Rs.10000 plus GST 18% through bank", "goods_gst_purchase_bank", "Purchases", "Bank"],
    ["Bought goods Rs.10000 plus GST 18% by UPI", "goods_gst_purchase_bank", "Purchases", "Bank"],
    ["Purchased goods Rs.10000 plus GST 18% on credit", "goods_gst_purchase_credit", "Purchases", "Creditor"],
    ["Purchased goods from Amit Rs.10000 plus GST 18% on credit", "goods_gst_purchase_credit", "Purchases", "Amit"],
    ["Purchased goods Rs.11800 including GST 18% for cash", "goods_gst_inclusive_purchase_cash", "Purchases", "Cash"],
    ["Purchased goods Rs.11800 GST inclusive 18% by GPay", "goods_gst_inclusive_purchase_bank", "Purchases", "Bank"],
    [
      "Purchased goods from Amit Rs.11800 including GST 18% on credit",
      "goods_gst_inclusive_purchase_credit",
      "Purchases",
      "Amit",
    ],
    ["Sold goods Rs.10000 plus GST 18% for cash", "goods_gst_sale_cash", "Cash", "Sales"],
    ["Sold goods Rs.10000 plus GST 18% through bank", "goods_gst_sale_bank", "Bank", "Sales"],
    ["Sold goods Rs.10000 plus GST 18% on credit", "goods_gst_sale_credit", "Debtor", "Sales"],
    ["Sold goods to Raju Rs.10000 plus GST 18% on credit", "goods_gst_sale_credit", "Raju", "Sales"],
    ["Sold goods Rs.11800 including GST 18% for cash", "goods_gst_inclusive_sale_cash", "Cash", "Sales"],
    ["Sold goods Rs.11800 GST inclusive 18% by GPay", "goods_gst_inclusive_sale_bank", "Bank", "Sales"],
    ["Sold goods to Raju Rs.11800 including GST 18% on credit", "goods_gst_inclusive_sale_credit", "Raju", "Sales"],
    ["Purchased goods Rs.10000 plus CGST 9% and SGST 9% for cash", "goods_gst_cgst_sgst_purchase_cash", "Purchases", "Cash"],
    ["Purchased goods Rs.10000 plus CGST 9% and SGST 9% through bank", "goods_gst_cgst_sgst_purchase_bank", "Purchases", "Bank"],
    [
      "Purchased goods from Amit Rs.10000 plus CGST 9% and SGST 9% on credit",
      "goods_gst_cgst_sgst_purchase_credit",
      "Purchases",
      "Amit",
    ],
    ["Sold goods Rs.10000 plus CGST 9% and SGST 9% for cash", "goods_gst_cgst_sgst_sale_cash", "Cash", "Sales"],
    ["Sold goods Rs.10000 plus CGST 9% and SGST 9% through bank", "goods_gst_cgst_sgst_sale_bank", "Bank", "Sales"],
    ["Sold goods to Raju Rs.10000 plus CGST 9% and SGST 9% on credit", "goods_gst_cgst_sgst_sale_credit", "Raju", "Sales"],
    ["Purchased goods Rs.10000 plus IGST 18% for cash", "goods_gst_igst_purchase_cash", "Purchases", "Cash"],
    ["Purchased goods Rs.10000 plus IGST 18% through bank", "goods_gst_igst_purchase_bank", "Purchases", "Bank"],
    ["Purchased goods from Amit Rs.10000 plus IGST 18% on credit", "goods_gst_igst_purchase_credit", "Purchases", "Amit"],
    ["Sold goods Rs.10000 plus IGST 18% for cash", "goods_gst_igst_sale_cash", "Cash", "Sales"],
    ["Sold goods Rs.10000 plus IGST 18% through bank", "goods_gst_igst_sale_bank", "Bank", "Sales"],
    ["Sold goods to Raju Rs.10000 plus IGST 18% on credit", "goods_gst_igst_sale_credit", "Raju", "Sales"],
    [
      "Purchased goods Rs.11800 including CGST 9% and SGST 9% for cash",
      "goods_gst_cgst_sgst_inclusive_purchase_cash",
      "Purchases",
      "Cash",
    ],
    [
      "Purchased goods Rs.11800 inclusive of CGST 9% and SGST 9% through bank",
      "goods_gst_cgst_sgst_inclusive_purchase_bank",
      "Purchases",
      "Bank",
    ],
    [
      "Purchased goods from Amit Rs.11800 CGST inclusive 9% and SGST 9% on credit",
      "goods_gst_cgst_sgst_inclusive_purchase_credit",
      "Purchases",
      "Amit",
    ],
    [
      "Sold goods Rs.11800 including CGST 9% and SGST 9% for cash",
      "goods_gst_cgst_sgst_inclusive_sale_cash",
      "Cash",
      "Sales",
    ],
    [
      "Sold goods Rs.11800 including IGST 18% through bank",
      "goods_gst_igst_inclusive_sale_bank",
      "Bank",
      "Sales",
    ],
    [
      "Sold goods to Raju Rs.11800 including IGST 18% on credit",
      "goods_gst_igst_inclusive_sale_credit",
      "Raju",
      "Sales",
    ],
    [
      "Purchased goods Rs.11800 including integrated GST 18% for cash",
      "goods_gst_igst_inclusive_purchase_cash",
      "Purchases",
      "Cash",
    ],
  ])("classifies GST goods transaction: %s", (transaction, transactionType, debitAccount, creditAccount) => {
    const classification = classifyTransaction(transaction);

    expect(classification).toMatchObject({
      transaction_type: transactionType,
      debitAccount,
      creditAccount,
      amount: 11800,
      confidence: 0.95,
    });
  });

  it("builds expected entries for GST goods purchase and sale", () => {
    const purchase = classifyTransaction("Purchased goods from Amit Rs.10000 plus GST 18% on credit");
    const sale = classifyTransaction("Sold goods to Raju Rs.10000 plus GST Rs.1800 on credit");
    const inclusivePurchase = classifyTransaction("Purchased goods from Amit Rs.11800 including GST 18% on credit");
    const inclusiveSale = classifyTransaction("Sold goods to Raju Rs.11800 including GST 18% on credit");
    const splitPurchase = classifyTransaction("Purchased goods Rs.10000 plus CGST Rs.900 and SGST Rs.900 for cash");
    const splitSale = classifyTransaction("Sold goods Rs.10000 plus IGST Rs.1800 for cash");
    const inclusiveSplitPurchase = classifyTransaction(
      "Purchased goods from Amit Rs.11800 including CGST 9% and SGST 9% on credit",
    );
    const inclusiveSplitSale = classifyTransaction("Sold goods Rs.11800 including IGST 18% for cash");

    expect(generateExpectedEntry(purchase!)).toMatchObject({
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Amit", amount: 11800, acceptedAccounts: ["Creditor"] }],
    });
    expect(generateExpectedEntry(sale!)).toMatchObject({
      debits: [{ account: "Raju", amount: 11800, acceptedAccounts: ["Debtor"] }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    });
    expect(generateExpectedEntry(inclusivePurchase!)).toMatchObject({
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Amit", amount: 11800, acceptedAccounts: ["Creditor"] }],
    });
    expect(generateExpectedEntry(inclusiveSale!)).toMatchObject({
      debits: [{ account: "Raju", amount: 11800, acceptedAccounts: ["Debtor"] }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    });
    expect(generateExpectedEntry(splitPurchase!)).toEqual({
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input CGST", amount: 900 },
        { account: "Input SGST", amount: 900 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    });
    expect(generateExpectedEntry(splitSale!)).toEqual({
      debits: [{ account: "Cash", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output IGST", amount: 1800 },
      ],
    });
    expect(generateExpectedEntry(inclusiveSplitPurchase!)).toEqual({
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input CGST", amount: 900 },
        { account: "Input SGST", amount: 900 },
      ],
      credits: [{ account: "Amit", amount: 11800, acceptedAccounts: ["Creditor"], partyRole: "creditor" }],
    });
    expect(generateExpectedEntry(inclusiveSplitSale!)).toEqual({
      debits: [{ account: "Cash", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output IGST", amount: 1800 },
      ],
    });
  });

  it.each([
    [
      "Purchased machinery Rs.50000 plus GST 18% for cash",
      "asset_gst_purchase_machinery_cash",
      "Machinery",
      "Cash",
      59000,
    ],
    [
      "Bought laptop Rs.30000 plus GST 18% by UPI",
      "asset_gst_purchase_laptop_bank",
      "Computer",
      "Bank",
      35400,
    ],
    [
      "Purchased furniture from Rahul Rs.20000 plus GST 18% on credit",
      "asset_gst_purchase_furniture_credit",
      "Furniture",
      "Rahul",
      23600,
    ],
    [
      "Purchased machinery Rs.59000 including GST 18% for cash",
      "asset_gst_inclusive_purchase_machinery_cash",
      "Machinery",
      "Cash",
      59000,
    ],
    [
      "Bought laptop Rs.35400 including GST 18% by UPI",
      "asset_gst_inclusive_purchase_laptop_bank",
      "Computer",
      "Bank",
      35400,
    ],
    [
      "Purchased machinery Rs.50000 plus CGST 9% and SGST 9% for cash",
      "asset_gst_cgst_sgst_purchase_machinery_cash",
      "Machinery",
      "Cash",
      59000,
    ],
    [
      "Purchased machinery Rs.50000 plus IGST 18% through bank",
      "asset_gst_igst_purchase_machinery_bank",
      "Machinery",
      "Bank",
      59000,
    ],
  ])("classifies asset GST purchase: %s", (transaction, transactionType, debitAccount, creditAccount, amount) => {
    const classification = classifyTransaction(transaction);

    expect(classification).toMatchObject({
      transaction_type: transactionType,
      debitAccount,
      creditAccount,
      amount,
      confidence: 0.95,
    });
  });

  it("builds expected entries for asset GST purchases", () => {
    const machinery = classifyTransaction("Purchased machinery Rs.50000 plus GST 18% for cash");
    const laptop = classifyTransaction("Bought laptop Rs.35400 including GST 18% by UPI");
    const split = classifyTransaction("Purchased machinery Rs.50000 plus CGST 9% and SGST 9% for cash");
    const igst = classifyTransaction("Purchased machinery Rs.50000 plus IGST 18% for cash");
    const namedSupplier = classifyTransaction("Bought laptop Rs.30000 plus GST 18% from Amit on credit");

    expect(generateExpectedEntry(machinery!)).toEqual({
      debits: [
        { account: "Machinery", amount: 50000 },
        { account: "Input GST", amount: 9000 },
      ],
      credits: [{ account: "Cash", amount: 59000 }],
    });
    expect(generateExpectedEntry(laptop!)).toEqual({
      debits: [
        { account: "Computer", amount: 30000 },
        { account: "Input GST", amount: 5400 },
      ],
      credits: [{ account: "Bank", amount: 35400 }],
    });
    expect(generateExpectedEntry(split!)).toEqual({
      debits: [
        { account: "Machinery", amount: 50000 },
        { account: "Input CGST", amount: 4500 },
        { account: "Input SGST", amount: 4500 },
      ],
      credits: [{ account: "Cash", amount: 59000 }],
    });
    expect(generateExpectedEntry(igst!)).toEqual({
      debits: [
        { account: "Machinery", amount: 50000 },
        { account: "Input IGST", amount: 9000 },
      ],
      credits: [{ account: "Cash", amount: 59000 }],
    });
    expect(generateExpectedEntry(namedSupplier!)).toEqual({
      debits: [
        { account: "Computer", amount: 30000 },
        { account: "Input GST", amount: 5400 },
      ],
      credits: [{ account: "Amit", amount: 35400, acceptedAccounts: ["Creditor"], partyRole: "creditor" }],
    });
  });

  it.each([
    [
      "Paid installation charges on machinery Rs.5000 in cash",
      "asset_installation_installation_machinery_cash",
      "Machinery",
      "Cash",
      5000,
    ],
    [
      "Installation charges on machinery Rs.5000 paid in cash",
      "asset_installation_installation_machinery_cash",
      "Machinery",
      "Cash",
      5000,
    ],
    [
      "Paid erection charges on machinery Rs.5000 through bank",
      "asset_installation_erection_machinery_bank",
      "Machinery",
      "Bank",
      5000,
    ],
    [
      "Paid setup charges on laptop Rs.1500 by UPI",
      "asset_installation_setup_laptop_bank",
      "Computer",
      "Bank",
      1500,
    ],
    [
      "Paid fitting charges on printer Rs.1000 in cash",
      "asset_installation_fitting_printer_cash",
      "Equipment",
      "Cash",
      1000,
    ],
    [
      "Paid carriage on machinery Rs.2000 in cash",
      "asset_installation_carriage_machinery_cash",
      "Machinery",
      "Cash",
      2000,
    ],
    [
      "Paid freight on machinery Rs.2000 through bank",
      "asset_installation_freight_machinery_bank",
      "Machinery",
      "Bank",
      2000,
    ],
  ])("classifies asset installation charge: %s", (transaction, transactionType, debitAccount, creditAccount, amount) => {
    const classification = classifyTransaction(transaction);

    expect(classification).toMatchObject({
      transaction_type: transactionType,
      debitAccount,
      creditAccount,
      amount,
      confidence: 0.95,
    });
  });

  it("builds expected entries for asset installation charges", () => {
    const machineryCash = classifyTransaction("Paid installation charges on machinery Rs.5000 in cash");
    const laptopBank = classifyTransaction("Paid setup charges on laptop Rs.1500 by UPI");
    const printerCash = classifyTransaction("Paid fitting charges on printer Rs.1000 in cash");

    expect(generateExpectedEntry(machineryCash!)).toEqual({
      debits: [{ account: "Machinery", amount: 5000 }],
      credits: [{ account: "Cash", amount: 5000 }],
    });
    expect(generateExpectedEntry(laptopBank!)).toEqual({
      debits: [{ account: "Computer", amount: 1500 }],
      credits: [{ account: "Bank", amount: 1500 }],
    });
    expect(generateExpectedEntry(printerCash!)).toEqual({
      debits: [{ account: "Equipment", amount: 1000 }],
      credits: [{ account: "Cash", amount: 1000 }],
    });
  });

  it.each([
    [
      "Purchased machinery Rs.50000 and paid installation charges Rs.5000 in cash",
      "asset_purchase_installation_installation_machinery_cash",
      "Machinery",
      "Cash",
      55000,
    ],
    [
      "Bought laptop Rs.30000 and paid setup charges Rs.1500 by UPI",
      "asset_purchase_installation_setup_laptop_bank",
      "Computer",
      "Bank",
      31500,
    ],
    [
      "Purchased machinery from Amit Rs.50000 plus installation charges Rs.5000 on credit",
      "asset_purchase_installation_installation_machinery_credit",
      "Machinery",
      "Amit",
      55000,
    ],
    [
      "Bought printer Rs.8000 and paid fitting charges Rs.1000 in cash",
      "asset_purchase_installation_fitting_printer_cash",
      "Equipment",
      "Cash",
      9000,
    ],
    [
      "Purchased machinery Rs.50000 plus freight Rs.2000 for cash",
      "asset_purchase_installation_freight_machinery_cash",
      "Machinery",
      "Cash",
      52000,
    ],
  ])(
    "classifies asset purchase plus installation charge: %s",
    (transaction, transactionType, debitAccount, creditAccount, amount) => {
      const classification = classifyTransaction(transaction);

      expect(classification).toMatchObject({
        transaction_type: transactionType,
        debitAccount,
        creditAccount,
        amount,
        confidence: 0.95,
      });
    },
  );

  it("builds expected entries for asset purchase plus installation charges", () => {
    const machineryCash = classifyTransaction("Purchased machinery Rs.50000 and paid installation charges Rs.5000 in cash");
    const laptopBank = classifyTransaction("Bought laptop Rs.30000 and paid setup charges Rs.1500 by UPI");
    const namedCredit = classifyTransaction(
      "Purchased machinery from Amit Rs.50000 plus installation charges Rs.5000 on credit",
    );

    expect(generateExpectedEntry(machineryCash!)).toEqual({
      debits: [{ account: "Machinery", amount: 55000 }],
      credits: [{ account: "Cash", amount: 55000 }],
    });
    expect(generateExpectedEntry(laptopBank!)).toEqual({
      debits: [{ account: "Computer", amount: 31500 }],
      credits: [{ account: "Bank", amount: 31500 }],
    });
    expect(generateExpectedEntry(namedCredit!)).toEqual({
      debits: [{ account: "Machinery", amount: 55000 }],
      credits: [{ account: "Amit", amount: 55000, acceptedAccounts: ["Creditor"], partyRole: "creditor" }],
    });
  });

  it.each([
    ["Sold machinery Rs.40000 for cash", "asset_sale_machinery_cash", "Cash", "Machinery", 40000],
    ["Sold laptop Rs.20000 through bank", "asset_sale_laptop_bank", "Bank", "Computer", 20000],
    ["Sold car to Raju Rs.250000 on credit", "asset_sale_vehicle_credit", "Raju", "Vehicle", 250000],
    ["Sold land through bank Rs.300000", "asset_sale_land_bank", "Bank", "Land", 300000],
    ["Machinery sold to Raju Rs.40000 on credit", "asset_sale_machinery_credit", "Raju", "Machinery", 40000],
    ["Sold printer Rs.5000 for cash", "asset_sale_printer_cash", "Cash", "Equipment", 5000],
    ["Sold generator Rs.25000 by UPI", "asset_sale_generator_bank", "Bank", "Equipment", 25000],
  ])("classifies asset sale: %s", (transaction, transactionType, debitAccount, creditAccount, amount) => {
    const classification = classifyTransaction(transaction);

    expect(classification).toMatchObject({
      transaction_type: transactionType,
      debitAccount,
      creditAccount,
      amount,
      confidence: 0.95,
    });
  });

  it("builds expected entries for asset sales", () => {
    const cashSale = classifyTransaction("Sold machinery Rs.40000 for cash");
    const bankSale = classifyTransaction("Sold laptop Rs.20000 through bank");
    const creditSale = classifyTransaction("Sold car to Raju Rs.250000 on credit");

    expect(generateExpectedEntry(cashSale!)).toEqual({
      debits: [{ account: "Cash", amount: 40000 }],
      credits: [{ account: "Machinery", amount: 40000 }],
    });
    expect(generateExpectedEntry(bankSale!)).toEqual({
      debits: [{ account: "Bank", amount: 20000 }],
      credits: [{ account: "Computer", amount: 20000 }],
    });
    expect(generateExpectedEntry(creditSale!)).toEqual({
      debits: [{ account: "Raju", amount: 250000, acceptedAccounts: ["Debtor"], partyRole: "debtor" }],
      credits: [{ account: "Vehicle", amount: 250000 }],
    });
  });

  it("does not classify unsupported transactions", () => {
    expect(classifyTransaction("Paid insurance premium ₹5,000")).toBeNull();
    expect(classifyTransaction("Depreciation charged Rs.5000")).toBeNull();
    expect(classifyTransaction("Depreciation charged on unknown asset Rs.5000")).toBeNull();
    expect(classifyTransaction("Provision for doubtful debts created Rs.1000")).toBeNull();
    expect(classifyTransaction("Bad debts recovered and transferred to provision for doubtful debts Rs.500")).toBeNull();
    expect(classifyTransaction("Discount allowed Rs.500")).toBeNull();
    expect(classifyTransaction("GST paid Rs.1000")).toBeNull();
    expect(classifyTransaction("Purchased goods Rs.11800 including GST for cash")).toBeNull();
    expect(classifyTransaction("Purchased goods Rs.11800 including CGST and SGST for cash")).toBeNull();
    expect(classifyTransaction("Sold goods Rs.11800 including tax for cash")).toBeNull();
    expect(classifyTransaction("Sold goods Rs.10000 plus CGST and SGST for cash")).toBeNull();
    expect(classifyTransaction("Sold goods Rs.10000 less trade discount 10%")).toBeNull();
    expect(classifyTransaction("Sold goods Rs.10000 plus GST and allowed discount Rs.500")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.59000 including CGST 9% and SGST 9% for cash")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.50000 plus installation Rs.5000 plus GST 18%")).toBeNull();
    expect(classifyTransaction("Sold machinery Rs.40000 plus GST 18%")).toBeNull();
    expect(classifyTransaction("Paid installation charges on machinery Rs.5000 plus GST 18%")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.50000 and paid installation charges Rs.5000")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.50000 plus installation Rs.5000 plus GST 18%")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.50000 through bank and paid installation Rs.5000 in cash")).toBeNull();
    expect(classifyTransaction("Purchased machinery Rs.50000 and paid repair charges Rs.5000")).toBeNull();
    expect(classifyTransaction("Sold machinery Rs.40000")).toBeNull();
    expect(classifyTransaction("Sold machinery costing Rs.50000 for Rs.40000")).toBeNull();
    expect(classifyTransaction("Sold machinery Rs.40000 plus GST 18%")).toBeNull();
    expect(classifyTransaction("Sold machinery Rs.40000 and received Rs.10000 cash, balance on credit")).toBeNull();
    expect(classifyTransaction("Goods lost by fire Rs.3000, insurance claim admitted Rs.2000")).toBeNull();
    expect(classifyTransaction("Goods lost by fire Rs.3000 and insurance company accepted claim Rs.2000")).toBeNull();
    expect(classifyTransaction("Insurance claim received for goods lost by fire Rs.2000")).toBeNull();
    expect(classifyTransaction("Goods lost by fire and insurance claim pending Rs.3000")).toBeNull();
    expect(classifyTransaction("Goods returned by Raju and cash refunded Rs.1000")).toBeNull();
    expect(classifyTransaction("Goods returned by customer Rs.1000 and cash refunded")).toBeNull();
    expect(classifyTransaction("Sales return with GST Rs.1000")).toBeNull();
    expect(classifyTransaction("Sales return with discount Rs.1000")).toBeNull();
    expect(classifyTransaction("Goods returned to Amit and cash refund received Rs.1000")).toBeNull();
    expect(classifyTransaction("Goods returned to supplier Rs.1000 and cash refunded")).toBeNull();
    expect(classifyTransaction("Purchase return with GST Rs.1000")).toBeNull();
    expect(classifyTransaction("Purchase return with discount Rs.1000")).toBeNull();
  });

  it("does not classify transactions without an amount", () => {
    expect(classifyTransaction("Paid rent in cash")).toBeNull();
  });

  it("does not guess ambiguous sales wording", () => {
    expect(classifyTransaction("Goods worth Rs.1000 sold for Rs.900 after discount Rs.100")).toBeNull();
    expect(classifyTransaction("Sold goods after discount Rs.100")).toBeNull();
  });

  it("does not guess ambiguous furniture item purchase wording", () => {
    expect(classifyTransaction("Bought table Rs.1000")).toBeNull();
  });

  it("does not guess ambiguous trade-discount purchase wording", () => {
    expect(classifyTransaction("Goods worth Rs.1000 purchased for Rs.900 after discount Rs.100")).toBeNull();
    expect(classifyTransaction("Purchased goods after discount Rs.100")).toBeNull();
  });

  it("does not guess ambiguous rent or salary payment wording", () => {
    expect(classifyTransaction("Paid rent Rs.5000")).toBeNull();
    expect(classifyTransaction("Salary paid Rs.6000")).toBeNull();
  });

  it("does not guess ambiguous drawings wording", () => {
    expect(classifyTransaction("Owner withdrew Rs.5000")).toBeNull();
  });

  it("does not guess ambiguous debtor or creditor wording", () => {
    expect(classifyTransaction("Received from debtor Rs.10000")).toBeNull();
    expect(classifyTransaction("Paid creditor Rs.7000")).toBeNull();
    expect(classifyTransaction("Creditor paid Rs.7000 in cash")).toBeNull();
  });

  it("does not guess ambiguous loan wording", () => {
    expect(classifyTransaction("Took loan Rs.50000")).toBeNull();
    expect(classifyTransaction("Repaid loan Rs.10000")).toBeNull();
  });

  it("does not guess ambiguous interest wording", () => {
    expect(classifyTransaction("Paid interest Rs.2000")).toBeNull();
    expect(classifyTransaction("Received interest Rs.1500")).toBeNull();
  });

  it("does not guess ambiguous commission wording", () => {
    expect(classifyTransaction("Received commission Rs.3000")).toBeNull();
  });

  it("returns 0.95 confidence for a direct natural capital-introduced cash match", () => {
    const classification = classifyTransaction("Owner invest Rs.50000 cash into business");

    expect(classification).toMatchObject({
      transaction_type: "capital_introduced_cash",
      amount: 50000,
      debitAccount: "Cash",
      creditAccount: "Capital",
      expectedDebitAccount: "Cash",
      expectedCreditAccount: "Capital",
      confidence: 0.95,
    });
  });

  it("returns 0.95 confidence for direct loan matches", () => {
    expect(classifyTransaction("Took loan Rs.50000 in cash")).toMatchObject({
      transaction_type: "loan_taken_cash",
      amount: 50000,
      debitAccount: "Cash",
      creditAccount: "Loan",
      expectedDebitAccount: "Cash",
      expectedCreditAccount: "Loan",
      confidence: 0.95,
    });
    expect(classifyTransaction("Repaid loan Rs.10000 through bank")).toMatchObject({
      transaction_type: "loan_repaid_bank",
      amount: 10000,
      debitAccount: "Loan",
      creditAccount: "Bank",
      expectedDebitAccount: "Loan",
      expectedCreditAccount: "Bank",
      confidence: 0.95,
    });
  });

  it("returns 0.95 confidence for direct interest matches", () => {
    expect(classifyTransaction("Paid interest Rs.2000 in cash")).toMatchObject({
      transaction_type: "interest_paid_cash",
      amount: 2000,
      debitAccount: "Interest Expense",
      creditAccount: "Cash",
      expectedDebitAccount: "Interest Expense",
      expectedCreditAccount: "Cash",
      confidence: 0.95,
    });
    expect(classifyTransaction("Received interest Rs.1500 through bank")).toMatchObject({
      transaction_type: "interest_received_bank",
      amount: 1500,
      debitAccount: "Bank",
      creditAccount: "Interest Income",
      expectedDebitAccount: "Bank",
      expectedCreditAccount: "Interest Income",
      confidence: 0.95,
    });
  });

  it("returns 0.95 confidence for direct commission matches", () => {
    expect(classifyTransaction("Received commission Rs.3000 in cash")).toMatchObject({
      transaction_type: "commission_received_cash",
      amount: 3000,
      debitAccount: "Cash",
      creditAccount: "Commission Income",
      expectedDebitAccount: "Cash",
      expectedCreditAccount: "Commission Income",
      confidence: 0.95,
    });
    expect(classifyTransaction("Received commission Rs.3000 through bank")).toMatchObject({
      transaction_type: "commission_received_bank",
      amount: 3000,
      debitAccount: "Bank",
      creditAccount: "Commission Income",
      expectedDebitAccount: "Bank",
      expectedCreditAccount: "Commission Income",
      confidence: 0.95,
    });
  });
});
