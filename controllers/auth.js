const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("pages/login", {
    pageTitle: "Login to your account",
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // make sure the session is created before continue
      req.session.save((err) => {
        // console.log(err);
        res.redirect("/dashboard");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    //console.log(err);
    res.redirect("/");
  });
};
