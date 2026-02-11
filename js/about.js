const toggle = document.querySelector(".about-toggle");
const statement = document.querySelector(".about-statement");

toggle.addEventListener("click", () => {
  const expanded = toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute("aria-expanded", !expanded);
  statement.classList.toggle("is-hidden");

  toggle.textContent = expanded
    ? "If you’re curious why I do this"
    : "Hide the longer version";
});
