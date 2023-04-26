const express = require("express");

const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email", "This is not a valid email format.")
      .isEmail()
      .normalizeEmail(),
    body("password", "Password is incorrect").isStrongPassword().trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("This is not a valid email format.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail already exists!");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Password should be at least 8 characters long and should contain at least one capital letter, one number and one special character."
    )
      .isStrongPassword()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords are not the same.");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
