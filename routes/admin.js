const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/", adminController.getIndex);

router.get("/dashboard", adminController.getDashboard);

// router.get("/transactions/add-transaction", adminController.getForm);
// router.post("/transactions/update-form", adminController.getUpdatedForm);
// router.post("/transactions/add-expense", adminController.postExpense);
// router.post("/transactions/add-revenue", adminController.postRevenue);

module.exports = router;
