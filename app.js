const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const User = require("./models/user");

const MONGODB_URI = "";

const app = express();
// here we store session on the server not in the memory
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const transactionsRoutes = require("./routes/transactions");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// here we initialize a session
app.use(
  session({
    secret: "budgetappsecretkeyvalue",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(adminRoutes);
app.use(authRoutes);
app.use(transactionsRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "John Doe",
          email: "john.doe@test.com",
          expenses: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
