const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", adminController.getIndex);

router.get("/dashboard", isAuth, adminController.getDashboard);

// router.get("/transactions/add-transaction", adminController.getForm);
// router.post("/transactions/update-form", adminController.getUpdatedForm);
// router.post("/transactions/add-expense", adminController.postExpense);
// router.post("/transactions/add-revenue", adminController.postRevenue);

module.exports = router;
