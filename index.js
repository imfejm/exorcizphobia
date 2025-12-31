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

//zastavení animace při 50% viditelnosti
function checkAnimationVisibility() {
  const uvod = document.querySelector(".uvod");
  const black = document.querySelector(".black");
  const logoB = document.querySelector(".logoB");

  if (!uvod || !black || !logoB) return;

  const rect = uvod.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Vypočítá, kolik % sekce je viditelné
  const visibleHeight =
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const totalHeight = rect.height;
  const visibilityPercentage = (visibleHeight / totalHeight) * 100;

  // Když je viditelnost 50% nebo méně, zastaví animaci
  if (visibilityPercentage <= 50) {
    black.classList.add("paused");
    logoB.classList.add("paused");
  } else {
    black.classList.remove("paused");
    logoB.classList.remove("paused");
  }
}

window.addEventListener("scroll", checkAnimationVisibility);
window.addEventListener("resize", checkAnimationVisibility);
checkAnimationVisibility();

//animace příjezdu merchbanner zprava
const merchBanner = document.querySelector(".merchbanner");

if (merchBanner) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px",
    }
  );

  observer.observe(merchBanner);
}

//animace příjezdu mediabanner zleva a organizerbanner zprava
const mediaBanner = document.querySelector(".mediabanner");
const organizerBanner = document.querySelector(".organizerbanner");

const slideObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-in");
        slideObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "0px",
  }
);

if (mediaBanner) {
  slideObserver.observe(mediaBanner);
}

if (organizerBanner) {
  slideObserver.observe(organizerBanner);
}

//animace postupného objevování členů týmu
const members = document.querySelectorAll(
  ".member1, .member2, .member3, .member4"
);

const memberObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("member-visible");
        memberObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px",
  }
);

members.forEach((member) => {
  memberObserver.observe(member);
});

// Load Entries
async function loadEntries() {
  const ENDPOINT = "https://exorcizphobia.com/server.php";
  const tableLoading = document.querySelector(".tableLoading");
  const entriesTable = document.querySelector(".entriesTable");

  tableLoading.classList.remove("hidden");
  entriesTable.classList.add("hidden");

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "load",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      displayEntries(data || [], entriesTable);
    } else {
      displayEntries([], entriesTable);
    }
  } finally {
    tableLoading.classList.add("hidden");
    entriesTable.classList.remove("hidden");
  }
}

// Display Entries in Table
function displayEntries(entries, entriesTable) {
  const entriesBody = document.querySelector(".entriesBody");
  entriesBody.innerHTML = "";

  entries.forEach((entry) => {
    // Format date to Czech format (den.měsíc.rok)
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('cs-CZ');

    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>${entry.town}</td>
            <td>${entry.venue}</td>
            <td>${entry.description}</td>
            <td>${entry.link}</td>
        `;
    entriesBody.appendChild(row);
  });
}

// Load entries on page load
loadEntries();
