//navigace na klik a krizek z ham
const tlacitko = document.querySelector("#ham");
const rozbal = document.querySelector("#menu");
const odkazy = rozbal.querySelectorAll("a");
const cara1 = document.querySelector("#cara1");
const cara2 = document.querySelector("#cara2");
const cara3 = document.querySelector("#cara3");

tlacitko.addEventListener("click", () => {
  rozbal.classList.toggle("hidden");

  cara1.classList.toggle("caraA");
  cara2.classList.toggle("caraB");
  cara3.classList.toggle("caraC");
});

// Zavření menu po kliknutí na jakýkoli odkaz
odkazy.forEach((link) => {
  link.addEventListener("click", () => {
    rozbal.classList.add("hidden");

    cara1.classList.remove("caraA");
    cara2.classList.remove("caraB");
    cara3.classList.remove("caraC");
  });
});

//logo do horní lišty + zastavení animace – společný scroll handler
const logoS = document.querySelector(".logoS");
const ham = document.querySelector(".ham");
const uvod = document.querySelector(".uvod");
const black = document.querySelector(".black");
const logoB = document.querySelector(".logoB");

let scrollTicking = false;

function onScrollHandler() {
  // Reads first (avoid forced reflow)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const isMobile = window.innerWidth <= 500;
  let visibilityPercentage = 100;
  if (uvod && black && logoB) {
    const rect = uvod.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    visibilityPercentage = (visibleHeight / rect.height) * 100;
  }

  // Writes after all reads
  if (scrollTop > 50) {
    logoS?.classList.add("visible");
    if (isMobile) {
      ham?.classList.add("visible");
    }
  } else {
    logoS?.classList.remove("visible");
    if (isMobile) {
      ham?.classList.remove("visible");
    }
  }

  if (uvod && black && logoB) {
    if (visibilityPercentage <= 50) {
      black.classList.add("paused");
      logoB.classList.add("paused");
    } else {
      black.classList.remove("paused");
      logoB.classList.remove("paused");
    }
  }

  scrollTicking = false;
}

function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(onScrollHandler);
    scrollTicking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScrollHandler();

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
    },
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
  },
);

if (mediaBanner) {
  slideObserver.observe(mediaBanner);
}

if (organizerBanner) {
  slideObserver.observe(organizerBanner);
}

//animace postupného objevování členů týmu
const members = document.querySelectorAll(
  ".member1, .member2, .member3, .member4",
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
  },
);

members.forEach((member) => {
  memberObserver.observe(member);
});

// Setup Show More Button for Concerts
function setupShowMoreButton(totalEntries) {
  const card = document.querySelector(".koncerty .card");

  // Remove existing button if it exists
  const existingBtn = document.querySelector(".showMoreBtn");
  if (existingBtn) {
    existingBtn.remove();
  }

  // Only create button if there are more than 4 entries
  if (totalEntries <= 4) {
    return;
  }

  // Create the button
  const showMoreBtn = document.createElement("button");
  showMoreBtn.className = "showMoreBtn";
  showMoreBtn.textContent = "více";

  // Add button to card (after table)
  card.appendChild(showMoreBtn);

  // Add click event listener
  showMoreBtn.addEventListener("click", () => {
    const expandableRows = document.querySelectorAll(
      '.entriesTable tr[data-expandable="true"]',
    );
    const isExpanded = showMoreBtn.classList.contains("expanded");

    if (isExpanded) {
      // Collapse - hide rows again
      expandableRows.forEach((row) => {
        row.classList.add("hidden-row");
      });

      // Scrollovat na začátek sekce koncertů
      setTimeout(() => {
        const koncertyAnchor = document.querySelector("#koncerty");
        if (koncertyAnchor) {
          koncertyAnchor.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
    } else {
      // Expand - show rows
      expandableRows.forEach((row) => {
        row.classList.remove("hidden-row");
      });
    }

    // Toggle button state
    showMoreBtn.classList.toggle("expanded");

    // Change button text using i18n
    if (showMoreBtn.classList.contains("expanded")) {
      showMoreBtn.textContent = window.i18n
        ? window.i18n.t("concerts.less")
        : "méně";
    } else {
      showMoreBtn.textContent = window.i18n
        ? window.i18n.t("concerts.more")
        : "více";
    }
  });

  // Set initial text using i18n
  showMoreBtn.textContent = window.i18n
    ? window.i18n.t("concerts.more")
    : "více";
}

// Load Entries
async function loadEntries() {
  const ENDPOINT = "https://api.exorcizphobia.com/server.php";
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = entries.filter((e) => new Date(e.date) >= today);

  upcoming.forEach((entry, index) => {
    // Format date to Czech format (den. měsíc. rok)
    const date = new Date(entry.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const row = document.createElement("tr");

    // Add hidden-row class and data attribute to rows after the 4th one (index > 3)
    if (index > 3) {
      row.classList.add("hidden-row");
      row.setAttribute("data-expandable", "true");
    }

    row.innerHTML = `
            <td><strong>${day}. ${month}. ${year}</strong></td>
            <td>${entry.town}</td>
            <td>${entry.venue}</td>
            <td>${entry.description}</td>
            <td>${entry.link ? `<a href="${entry.link}" target="_blank" rel="noopener noreferrer">web události →</a>` : ""}</td>
        `;
    entriesBody.appendChild(row);
  });

  // Create and setup "Show More" button if there are more than 4 entries
  setupShowMoreButton(upcoming.length);
}

// Load entries on page load
loadEntries();

// Po plném načtení stránky (včetně obrázků) znovu scrollovat na hash,
// aby se kompenzoval layout shift
window.addEventListener("load", () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView();
      }, 0);
    }
  }
});

// Lightbox pro galerii
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxArrowLeft = document.querySelector(".lightbox-arrow-left");
const lightboxArrowRight = document.querySelector(".lightbox-arrow-right");

let currentLightboxIndex = 0;
const largeImages = Array.from(galleryItems).map((item) =>
  item.getAttribute("data-large"),
);

function showLightboxImage(index) {
  currentLightboxIndex = index;
  lightboxImg.src = largeImages[currentLightboxIndex];
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    showLightboxImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

lightboxArrowLeft.addEventListener("click", (e) => {
  e.stopPropagation();
  currentLightboxIndex =
    (currentLightboxIndex - 1 + largeImages.length) % largeImages.length;
  showLightboxImage(currentLightboxIndex);
});

lightboxArrowRight.addEventListener("click", (e) => {
  e.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + 1) % largeImages.length;
  showLightboxImage(currentLightboxIndex);
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + largeImages.length) % largeImages.length;
    showLightboxImage(currentLightboxIndex);
  } else if (e.key === "ArrowRight") {
    currentLightboxIndex = (currentLightboxIndex + 1) % largeImages.length;
    showLightboxImage(currentLightboxIndex);
  }
});

// Swipe gesta pro mobil
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;

function handleSwipe(onLeft, onRight) {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      onRight();
    } else {
      onLeft();
    }
  }
}

// Swipe v lightboxu
lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lightbox.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(
      () => {
        currentLightboxIndex =
          (currentLightboxIndex - 1 + largeImages.length) % largeImages.length;
        showLightboxImage(currentLightboxIndex);
      },
      () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % largeImages.length;
        showLightboxImage(currentLightboxIndex);
      },
    );
  },
  { passive: true },
);

// Carousel - šipky
const galleryArrowLeft = document.querySelector(".gallery-arrow-left");
const galleryArrowRight = document.querySelector(".gallery-arrow-right");
const galleryTrack = document.querySelector(".gallery-track");

// Swipe v galerii (mobilní carousel)
galleryTrack.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

galleryTrack.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(
      () => {
        currentSlide =
          (currentSlide - 1 + galleryItems.length) % galleryItems.length;
        updateCarousel();
      },
      () => {
        currentSlide = (currentSlide + 1) % galleryItems.length;
        updateCarousel();
      },
    );
  },
  { passive: true },
);
let currentSlide = 0;

function isMobile() {
  return window.innerWidth < 600;
}

function updateCarousel() {
  galleryItems.forEach((item, index) => {
    item.classList.toggle("active", index === currentSlide);
  });
}

// Inicializace - první obrázek aktivní
updateCarousel();

galleryArrowLeft.addEventListener("click", () => {
  if (isMobile()) {
    currentSlide =
      (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    updateCarousel();
  } else {
    galleryTrack.scrollBy({ left: -300, behavior: "smooth" });
  }
});

galleryArrowRight.addEventListener("click", () => {
  if (isMobile()) {
    currentSlide = (currentSlide + 1) % galleryItems.length;
    updateCarousel();
  } else {
    galleryTrack.scrollBy({ left: 300, behavior: "smooth" });
  }
});
