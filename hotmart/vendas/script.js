// BitStream vendas - minimal JS (menu + minor UX)
(function () {
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.style.display = "none";
    mobileNav.setAttribute("aria-hidden", "true");
    burger?.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.style.display = "block";
    mobileNav.setAttribute("aria-hidden", "false");
    burger?.setAttribute("aria-expanded", "true");
  }

  if (burger && mobileNav) {
    mobileNav.style.display = "none";
    burger.addEventListener("click", () => {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Close on resize up
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }
})();
