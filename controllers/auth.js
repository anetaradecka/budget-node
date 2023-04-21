const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "",
    },
  })
);

const checkMessage = (req) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  return message;
};

exports.getLogin = (req, res, next) => {
  let message = checkMessage(req);
  res.render("pages/login", {
    pageTitle: "Login to your account",
    errorMessage: message,
    savedInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = checkMessage(req);
  res.render("pages/signup", {
    pageTitle: "Create an account",
    errorMessage: message,
    savedInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render("pages/login", {
      pageTitle: "Login to your account",
      errorMessage: errors.array()[0].msg,
      savedInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("pages/login", {
          pageTitle: "Login to your account",
          errorMessage: "Invalid email or password",
          savedInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // make sure the session is created before continue
            return req.session.save((err) => {
              //console.log(err);
              res.redirect("/dashboard");
            });
          }
          return res.status(422).render("pages/login", {
            pageTitle: "Login to your account",
            errorMessage: "Invalid email or password",
            savedInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //this will go throug the results of the middleware in routes and check if wehave errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("pages/signup", {
      pageTitle: "Create an account",
      errorMessage: errors.array()[0].msg,
      savedInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        expenses: { items: [] },
        incomes: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "",
        subject: "Signup succeeded",
        html: "<h1>You successfully signed up!</>",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getResetPassword = (req, res, next) => {
  let message = checkMessage(req);
  res.render("pages/reset-password", {
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "",
          subject: "Password reset",
          html: `<p>You requested password reset.</p>
          <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>`,
        });
      })
      .catch((err) => {
        const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  //retrieving the token from the url, $gt- greater than
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = checkMessage(req);
      res.render("pages/new-password", {
        pageTitle: "Set new password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
      // could send here another email with confirmation
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
