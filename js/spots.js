/**
 * Boston Spots page: neighborhood filter + sticky-sidebar tracking.
 * AI-generated (Claude Opus 5.5) — logged in the README's GenAI section.
 */
import { getSidebarLink, trackActiveCard } from "./track-active.js";

const CARD_SELECTOR = ".spot-card";

const cards = [...document.querySelectorAll(CARD_SELECTOR)];
const filterButtons = [...document.querySelectorAll(".filter-bar button")];
const filterStatus = document.querySelector("#filter-status");

/**
 * Show only the cards (and their sidebar links) in the chosen neighborhood.
 * "all" shows every card.
 */
function applyFilter(neighborhood) {
  let visibleCount = 0;

  cards.forEach((card) => {
    const isMatch =
      neighborhood === "all" || card.dataset.neighborhood === neighborhood;

    card.hidden = !isMatch;
    getSidebarLink(card).parentElement.hidden = !isMatch; // the <li>

    if (isMatch) {
      visibleCount += 1;
    }
  });

  // Sync pressed state so assistive tech knows which filter is active
  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === neighborhood),
    );
  });

  filterStatus.textContent = `Showing ${visibleCount} of ${cards.length} spots`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

// Hidden cards stop intersecting, so the tracker skips them automatically
trackActiveCard(CARD_SELECTOR);
