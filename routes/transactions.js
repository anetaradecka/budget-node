const express = require("express");

const transactionsController = require("../controllers/transactions");

const router = express.Router();

router.get("/expenses", transactionsController.getTransactions);

router.post(
  "/expenses/add-transaction",
  transactionsController.postNewTransaction
);

router.get("/incomes", transactionsController.getTransactions);

router.post(
  "/incomes/add-transaction",
  transactionsController.postNewTransaction
);

module.exports = router;
