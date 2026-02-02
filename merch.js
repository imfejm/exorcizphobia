//navigace na klik a krizek z ham
const tlacitko = document.querySelector("#ham");
const rozbal = document.querySelector("#menu");
const odkazy = rozbal.querySelectorAll("a");

tlacitko.addEventListener("click", () => {
  rozbal.classList.toggle("hidden");

  document.querySelector("#cara1").classList.toggle("caraA");
  document.querySelector("#cara2").classList.toggle("caraB");
  document.querySelector("#cara3").classList.toggle("caraC");
});

// Zavření menu po kliknutí na jakýkoli odkaz
odkazy.forEach((link) => {
  link.addEventListener("click", () => {
    rozbal.classList.add("hidden");

    document.querySelector("#cara1").classList.remove("caraA");
    document.querySelector("#cara2").classList.remove("caraB");
    document.querySelector("#cara3").classList.remove("caraC");
  });
});

//logo do horní lišty
function onScrollLogoS() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const logoS = document.querySelector(".logoS");

  if (scrollTop > 50) {
    logoS?.classList.add("visible");
  } else {
    logoS?.classList.remove("visible");
  }
}

window.addEventListener("scroll", onScrollLogoS);
window.addEventListener("resize", onScrollLogoS);
onScrollLogoS();

// Krizek v kategorii - scroll nahoru
document.querySelectorAll(".cds-toggle .close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Order summary
(function () {
  const orderItems = {};
  const orderSummary = document.getElementById("order-summary");
  const orderContainer = document.getElementById("order-items");

  function renderOrder() {
    orderContainer.innerHTML = "";
    const keys = Object.keys(orderItems);

    if (keys.length === 0) {
      orderSummary.style.display = "none";
      return;
    }

    orderSummary.style.display = "";

    keys.forEach((name) => {
      const row = document.createElement("div");
      row.className = "order-item";

      const nameEl = document.createElement("span");
      nameEl.className = "order-item-name";
      nameEl.textContent = name;

      const qty = document.createElement("input");
      qty.type = "number";
      qty.className = "order-item-qty";
      qty.min = 1;
      qty.value = orderItems[name];
      qty.addEventListener("change", function () {
        const val = parseInt(this.value, 10);
        if (val > 0) {
          orderItems[name] = val;
        } else {
          this.value = 1;
          orderItems[name] = 1;
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.className = "order-item-remove";
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", function () {
        delete orderItems[name];
        renderOrder();
      });

      row.appendChild(nameEl);
      row.appendChild(qty);
      row.appendChild(removeBtn);
      orderContainer.appendChild(row);
    });
  }

  document.querySelectorAll(".buy-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".item");
      const h3 = item ? item.querySelector("h3") : null;
      if (!h3) return;

      const name = h3.textContent.trim();
      if (orderItems[name]) {
        orderItems[name]++;
      } else {
        orderItems[name] = 1;
      }

      renderOrder();
      orderSummary.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
