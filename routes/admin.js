const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", adminController.getIndex);

router.get("/dashboard", isAuth, adminController.getDashboard);

router.get("/settings", isAuth, adminController.getSettings);

router.post("/settings", isAuth, adminController.postSettings);

module.exports = router;
