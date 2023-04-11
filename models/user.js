const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expenses: { items: [] },
  incomes: { items: [] },
});

userSchema.methods.addTransactionToBudget = function (type, item) {
  let listItems, updatedList;

  switch (type) {
    case "expense":
      listItems = [...this.expenses.items];

      listItems.push({ item });

      updatedList = { items: listItems };

      this.expenses = updatedList;
      break;
    case "income":
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

// userSchema.methods.addToExpenses = function (item) {
//   const listItems = [...this.expenses.items];

//   listItems.push({ item });

//   const updatedList = { items: listItems };

//   this.expenses = updatedList;

//   return this.save();
// };

module.exports = mongoose.model("User", userSchema);
