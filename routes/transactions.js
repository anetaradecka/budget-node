const express = require("express");

const transactionsController = require("../controllers/transactions");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/expenses", isAuth, transactionsController.getTransactions);

router.post(
  "/expenses/add-transaction",
  isAuth,
  transactionsController.postNewTransaction
);

router.post(
  "/expenses/delete-transaction",
  isAuth,
  transactionsController.postDeleteTransaction
);

router.get("/incomes", isAuth, transactionsController.getTransactions);

router.post(
  "/incomes/add-transaction",
  isAuth,
  transactionsController.postNewTransaction
);

module.exports = router;
