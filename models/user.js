const ENUM = require("../util/enums");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: { type: String, default: "default.jpg" },
  expenses: { items: [] },
  incomes: { items: [] },
  resetToken: String,
  resetTokenExpiration: String,
});

userSchema.methods.addTransactionToBudget = function (type, item) {
  let listItems, updatedList;

  switch (type) {
    case ENUM.TransactionTypes.EXPENSE:
      listItems = [...this.expenses.items];
      console.log(listItems);

      listItems.push({ item });

      updatedList = { items: listItems };

      this.expenses = updatedList;
      break;
    case ENUM.TransactionTypes.INCOME:
      listItems = [...this.incomes.items];

      listItems.push({ item });

      updatedList = { items: listItems };

      this.incomes = updatedList;
      break;
    default:
      console.log(`Error: invalid transaction type: ${type}.`);
  }
  return this.save();
};

userSchema.methods.removeTransactionFromBudget = function (
  type,
  transactionId
) {
  let updatedList;
  switch (type) {
    case ENUM.TransactionTypes.EXPENSE:
      updatedList = this.expenses.items.filter((item) => {
        return transactionId !== item.item._id.toString();
      });

      this.expenses.items = updatedList;
      break;
    case ENUM.TransactionTypes.INCOME:
      updatedList = this.incomes.items.filter((item) => {
        return transactionId !== item.item._id.toString();
      });

      this.incomes.items = updatedList;
      break;
    default:
      console.log(`Error: invalid transaction type: ${type}.`);
  }
  return this.save();
};

userSchema.methods.updateUser = function (imageUrl) {
  this.avatar = imageUrl;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
