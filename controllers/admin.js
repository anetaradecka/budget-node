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
    });
  }
};
