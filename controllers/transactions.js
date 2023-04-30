const Expense = require("../models/expense");
const Income = require("../models/income");
const ENUM = require("../util/enums");
const categoryList = require("../models/categories");
const moment = require("moment");

const convertDates = (transactions) => {
  transactions.map((transaction) => {
    const date = transaction.item.date;
    const newDate = moment(new Date(date)).format("ll");
    transaction.item.date = newDate;
  });
};

const filterForPagination = (transactions, page, ITEMS_PER_PAGE) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  transactions = transactions.slice(start, end);
  return transactions;
};

const checkForPaginationQuery = (originalUrl) => {
  if (originalUrl.includes("?")) {
    const url = originalUrl.slice(1).slice(0, -1);
    type = url.substring(0, url.indexOf("?")).slice(0, -1);
  } else {
    type = originalUrl.slice(1).slice(0, -1);
  }
  return type;
};

exports.getTransactions = (req, res, next) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = 10;
  let transactions;
  let categories;
  let totalTransactions;
  let pageTitle;
  let path;

  const type = checkForPaginationQuery(req.originalUrl);

  switch (type) {
    case ENUM.TransactionTypes.EXPENSE:
      transactions = req.user.expenses.items;
      console.log(transactions);
      categories = categoryList.ExpenseCategories;
      pageTitle = "Manage your expenses";
      path = `/${ENUM.TransactionTypes.EXPENSES}`;
      break;
    case ENUM.TransactionTypes.INCOME:
      transactions = req.user.incomes.items;
      categories = categoryList.IncomeCategories;
      pageTitle = "Manage your incomes";
      path = `/${ENUM.TransactionTypes.INCOMES}`;
      break;
    default:
      console.log(`Error: invalid transaction type: ${type}.`);
  }

  totalTransactions = transactions.length;

  transactions = filterForPagination(transactions, page, ITEMS_PER_PAGE);

  convertDates(transactions);

  res.render("pages/transactions", {
    pageTitle: pageTitle,
    path: path,
    transactions: transactions,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalTransactions,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalTransactions / ITEMS_PER_PAGE),
    type: type,
    categories: categories,
    user: req.user,
  });
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.postDeleteTransaction = (req, res, next) => {
//   const transactionId = req.body.transactionId;
//   const type = req.body.type;

//   req.user
//     .removeTransactionFromBudget(type, transactionId)
//     .then((result) => {
//       console.log(`Transaction of type ${type} has successfuly been removed`);
//       if (type === ENUM.TransactionTypes.EXPENSE) {
//         res.redirect("/expenses");
//       } else if (type === ENUM.TransactionTypes.INCOME) {
//         res.redirect("/incomes");
//       } else {
//         console.log(
//           `Unknown transaction type: ${type}. Redirect to dashboard.`
//         );
//         res.redirect("/dashboard");
//       }
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.deleteTransaction = (req, res, next) => {
  const transactionId = req.params.transactionId;
  const type = req.body.type;

  req.user
    .removeTransactionFromBudget(type, transactionId)
    .then((result) => {
      console.log(`Transaction of type ${type} has successfuly been removed`);
      res.status(200).json({
        message: `Transaction of type ${type} has successfuly been removed`,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: `Operation (delete transaction) failed.` });
    });
};
