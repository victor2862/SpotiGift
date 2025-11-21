const navButtons = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".content-page");
const bottomNav = document.querySelector(".bottom-nav");
const heroSection = document.querySelector(".hero");
const trackButtons = document.querySelectorAll(".track-card");
const playerOverlay = document.querySelector(".player-overlay");
const overlayArt = playerOverlay?.querySelector(".player-overlay__art");
const overlayTitle = playerOverlay?.querySelector(".player-overlay__title");
const overlayArtist = playerOverlay?.querySelector(".player-overlay__artist");
const overlayDismiss = playerOverlay?.querySelector(".player-overlay__dismiss");
const lyricsCard = playerOverlay?.querySelector(".lyrics-card");
const lyricsExcerpt = playerOverlay?.querySelector(".lyrics-card__excerpt");
const lyricsBody = playerOverlay?.querySelector(".lyrics-card__body");

// Search behavior
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const searchResult = document.querySelector(".search-result");
const searchCaption = document.querySelector(".search-result__caption");
let hasSearchResult = false;

function toggleSearchResult(show) {
  if (!searchResult) return;
  searchResult.hidden = !show;
  searchResult.classList.toggle("is-visible", show);
}

function resetSearchState() {
  hasSearchResult = false;
  toggleSearchResult(false);
  if (searchInput) {
    searchInput.value = "";
  }
}

function closePlayerOverlay() {
  if (!playerOverlay) return;
  playerOverlay.hidden = true;
  playerOverlay.classList.remove("is-visible");
  if (lyricsCard) {
    lyricsCard.classList.remove("is-expanded");
  }
  if (lyricsBody) {
    lyricsBody.hidden = true;
  }
  if (bottomNav) {
    bottomNav.classList.remove("is-hidden");
  }
}

function openPlayerOverlay(trackButton) {
  if (!playerOverlay) return;
  const { trackTitle, trackArtist, trackLyrics, trackArt } = trackButton.dataset;

  if (overlayTitle) {
    overlayTitle.textContent = trackTitle || "Faixa secreta";
  }
  if (overlayArtist) {
    overlayArtist.textContent = trackArtist || "Nos dois";
  }
  if (overlayArt) {
    overlayArt.dataset.art = trackArt || "aurora";
  }
  if (lyricsExcerpt) {
    if (trackLyrics) {
      const preview = trackLyrics.length > 110 ? `${trackLyrics.slice(0, 110)}...` : trackLyrics;
      lyricsExcerpt.textContent = preview;
    } else {
      lyricsExcerpt.textContent = "Clique para ler nossa mensagem.";
    }
  }
  if (lyricsBody) {
    lyricsBody.textContent = trackLyrics || "";
    lyricsBody.hidden = true;
  }
  if (lyricsCard) {
    lyricsCard.classList.remove("is-expanded");
  }

  playerOverlay.hidden = false;
  playerOverlay.classList.add("is-visible");
  playerOverlay.scrollTop = 0;

  if (bottomNav) {
    bottomNav.classList.add("is-hidden");
  }
}

function activatePage(target) {
  closePlayerOverlay();
  pages.forEach((page) => {
    const isMatch = page.dataset.page === target;
    page.classList.toggle("is-active", isMatch);
    page.hidden = !isMatch;
  });

  navButtons.forEach((btn) => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle("is-active", isActive);
    if (isActive) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.removeAttribute("aria-current");
    }
  });

  if (heroSection) {
    heroSection.hidden = target !== "home";
  }

  if (target === "search") {
    if (!hasSearchResult) {
      toggleSearchResult(false);
    }
  } else {
    resetSearchState();
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activatePage(button.dataset.target);
  });
});

trackButtons.forEach((button) => {
  button.addEventListener("click", () => openPlayerOverlay(button));
});

overlayDismiss?.addEventListener("click", closePlayerOverlay);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlayerOverlay();
  }
});

lyricsCard?.addEventListener("click", () => {
  const isExpanded = lyricsCard.classList.toggle("is-expanded");
  if (lyricsBody) {
    lyricsBody.hidden = !isExpanded;
  }
});

if (searchForm && searchInput && searchResult && searchCaption) {
  toggleSearchResult(false);

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchCaption.textContent = "Tudo que eu busco encontrei em voce.";
    toggleSearchResult(true);
    hasSearchResult = true;
  });
}

// Initialize default view
activatePage("home");
