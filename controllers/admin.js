exports.getIndex = (req, res, next) => {
  res.render("index", {
    pageTitle: "Home budget app",
    path: "/",
  });
};

exports.getDashboard = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  if (isLoggedIn) {
    res.render("pages/dashboard", {
      pageTitle: "My dashboard",
      path: "/dashboard",
      user: req.user,
    });
  }
};

exports.getSettings = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  if (isLoggedIn) {
    res.render("pages/settings", {
      pageTitle: "Account settings",
      path: "/settings",
      user: req.user,
      errorMessage: "",
      validationErrors: [],
    });
  }
};

exports.postSettings = (req, res, next) => {
  const image = req.file;

  if (!image) {
    return res.status(422).render("pages/settings", {
      pageTitle: "Account settings",
      path: "/settings",
      user: req.user,
      errorMessage: "Incorrect file format. Only jpg, jpeg and png allowed.",
      validationErrors: [],
    });
  }

  const imageUrl = image.filename;

  req.user
    .updateUser(imageUrl)
    .then((result) => {
      console.log(`User data has successfuly been updated!`);
      res.redirect("/dashboard");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
