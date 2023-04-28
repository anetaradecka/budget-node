function toggleModal() {
  document.getElementById("modal").classList.toggle("active");
}

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#secondary-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll("#secondary-menu .nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});
