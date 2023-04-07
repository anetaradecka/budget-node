const Expense = require("../models/expense");
const Income = require("../models/income");
const ENUM = require("../util/enums");
const moment = require("moment");

const convertDates = (transactions) => {
  transactions.map((transaction) => {
    const date = transaction.item.date;
    const newDate = moment(new Date(date)).format("ll");
    transaction.item.date = newDate;
  });
};

exports.getTransactions = (req, res, next) => {
  const type = req.originalUrl.slice(1);
  let transactions;

  switch (type) {
    case ENUM.TransactionTypes.EXPENSES:
      transactions = req.user.expenses.items;

      convertDates(transactions);

      res.render("pages/expenses", {
        pageTitle: "Expenses",
        path: "/expenses",
        expenses: transactions,
        type: type,
      });
      break;
    case ENUM.TransactionTypes.INCOMES:
      transactions = req.user.incomes.items;

      convertDates(transactions);

      res.render("pages/incomes", {
        pageTitle: "Incomes",
        path: "/incomes",
        incomes: transactions,
        type: type,
      });
      break;
    default:
      console.log(`Error: invalid transaction type: ${type}.`);
  }
};

exports.postNewTransaction = (req, res, next) => {
  const category = req.body.category;
  const value = req.body.value;
  const date = req.body.date;
  const comment = req.body.comment;
  const type = req.body.type;

  let transaction;

  switch (type) {
    case ENUM.TransactionTypes.EXPENSE:
      transaction = new Expense({
        category: category,
        value: value,
        date: date,
        comment: comment,
      });
      break;
    case ENUM.TransactionTypes.INCOME:
      transaction = new Income({
        category: category,
        value: value,
        date: date,
        comment: comment,
      });
      break;
    default:
      console.log(`Error: invalid transaction type: ${type}.`);
  }

  req.user
    .addTransactionToBudget(type, transaction)
    .then((result) => {
      console.log(`New ${type} has successfuly been added`);
      if (type === ENUM.TransactionTypes.EXPENSE) {
        res.redirect("/expenses");
      } else if (type === ENUM.TransactionTypes.INCOME) {
        res.redirect("/incomes");
      } else {
        console.log(`Unknown transaction type. Redirect to dashboard.`);
        res.redirect("/dashboard");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
