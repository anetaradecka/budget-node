const express = require("express");

const transactionsController = require("../controllers/transactions");

const router = express.Router();

router.get("/expenses", transactionsController.getTransactions);

router.post("/expenses/add-expense", transactionsController.postNewTransaction);

router.get("/incomes", transactionsController.getTransactions);

router.post("/incomes/add-income", transactionsController.postNewTransaction);

module.exports = router;
