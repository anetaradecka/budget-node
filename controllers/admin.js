exports.getIndex = (req, res, next) => {
  res.render("index", {
    pageTitle: "Home budget app",
    path: "/",
  });
};

exports.getDashboard = (req, res, next) => {
  res.render("pages/dashboard", {
    pageTitle: "My dashboard",
    path: "/dashboard",
  });
};

// strona główna z transakcjami, defaultowo generuje expensa
// exports.getTransactionsPage = (req, res, next) => {
//   ExpenseCategory.findAll()
//     .then((categories) => {
//       res.render("transactions", {
//         pageTitle: "Transactions",
//         path: "/transactions",
//         categories: categories,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.getUpdatedForm = (req, res, next) => {
//   const type = req.body.type;

//   if (type === "expense") {
//     ExpenseCategory.findAll()
//       .then((categories) => {
//         res.render("transactions", {
//           pageTitle: "Transactions",
//           path: "/transactions",
//           categories: categories,
//           submit: false,
//         });
//       })
//       .catch((err) => console.log(err));
//   } else if (type === "revenue") {
//     RevenueCategory.findAll()
//       .then((categories) => {
//         res.render("transactions", {
//           pageTitle: "Transactions",
//           path: "/transactions",
//           categories: categories,
//           submit: false,
//         });
//       })
//       .catch((err) => console.log(err));
//   } else {
//     console.log("error");
//   }
// };

// exports.postExpense = (req, res, next) => {
//   const category = req.body.category;
//   const value = req.body.value;
//   const date = req.body.date;
//   const description = req.body.description;
//   Expense.create({
//     category: category,
//     value: value,
//     date: date,
//     description: description,
//   })
//     .then((result) => {
//       console.log("Expense added");
//       res.redirect("/transactions");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postRevenue = (req, res, next) => {
//   const category = req.body.category;
//   const value = req.body.value;
//   const date = req.body.date;
//   const description = req.body.description;
//   Revenue.create({
//     category: category,
//     value: value,
//     date: date,
//     description: description,
//   })
//     .then((result) => {
//       console.log("Revenue added");
//       res.redirect("/transactions");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
