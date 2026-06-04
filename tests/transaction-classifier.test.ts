import { describe, expect, it } from "vitest";
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
    ["Purchased goods from Kuldeep Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 3000],
    ["Bought goods from Raju Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 3000],
    ["Goods purchased from Amit Rs.3000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 3000],
    ["Bought mangoes from seller Rs.500", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 500],
    ["Purchased rice from supplier Rs.1000", "assumed_credit_named_goods_purchase", "Purchases", "Creditor", 1000],
    ["Purchase goods from Kuldeep on credit Rs. 500", "named_goods_purchase_credit", "Purchases", "Creditor", 500],
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
    ["Purchase machinery from Kuldeep on credit Rs. 500", "asset_purchase_machinery_credit", "Machinery", "Creditor", 500],
    ["Purchased machinery from Kuldeep on credit Rs. 500", "asset_purchase_machinery_credit", "Machinery", "Creditor", 500],
    ["Bought machinery from Rahul on credit Rs. 1000", "asset_purchase_machinery_credit", "Machinery", "Creditor", 1000],
    ["Purchase furniture from Amit on credit Rs. 2000", "asset_purchase_furniture_credit", "Furniture", "Creditor", 2000],
    ["Bought table from Raju on credit Rs.1000", "asset_purchase_furniture_credit", "Furniture", "Creditor", 1000],
    ["Purchase table from Raju on credit Rs.1000", "asset_purchase_furniture_credit", "Furniture", "Creditor", 1000],
    ["Purchased chair from Amit on credit Rs.2000", "asset_purchase_furniture_credit", "Furniture", "Creditor", 2000],
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
    ["Sold Mango to Bidyut Rs. 500", "assumed_credit_named_goods_sale", "Debtor", "Sales", 500],
    ["Sold apples to Rahul Rs. 700", "assumed_credit_named_goods_sale", "Debtor", "Sales", 700],
    ["Sold rice to Amit Rs. 1000", "assumed_credit_named_goods_sale", "Debtor", "Sales", 1000],
    ["Sold goods to Bidyut Rs. 500", "assumed_credit_named_goods_sale", "Debtor", "Sales", 500],
    ["Sold mangoes to customer Rs. 500", "assumed_credit_named_goods_sale", "Debtor", "Sales", 500],
    ["Goods sold to Rahul Rs. 700", "assumed_credit_named_goods_sale", "Debtor", "Sales", 700],
    ["Sold goods to Kuldeep Rs.5000", "assumed_credit_named_goods_sale", "Debtor", "Sales", 5000],
    ["Goods sold to Kuldeep Rs.5000", "assumed_credit_named_goods_sale", "Debtor", "Sales", 5000],
    ["Sale of goods to Amit Rs.1000", "assumed_credit_named_goods_sale", "Debtor", "Sales", 1000],
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

  it("does not classify unsupported transactions", () => {
    expect(classifyTransaction("Paid insurance premium ₹5,000")).toBeNull();
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
