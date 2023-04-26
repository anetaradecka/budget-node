const deleteTransaction = (btn) => {
  const transactionId = btn.parentNode.querySelector(
    "[name=transactionId]"
  ).value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const type = btn.parentNode.querySelector("[name=type]").value;
  const transactionItem = btn.closest(".transaction-item");

  const formData = new FormData();
  formData.append("type", type);

  fetch("/expenses/transaction/" + transactionId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
    body: formData,
  })
    .then((results) => {
      return results.json();
    })
    .then((data) => {
      console.log(data);
      transactionItem.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
