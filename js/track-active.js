/**
 * Function to map the sidebar item to its corresponding cafe
 * card. Returns the link to the cafe card
 */
export function getSidebarLink(card) {
  return document.querySelector(`.sidebar nav a[href="#${card.id}"]`);
}

/**
 * remove highlights from all links
 */
function resetSideBar() {
  const sideLinks = document.querySelectorAll(".sidebar nav a");
  sideLinks.forEach((link) => {
    link.removeAttribute("aria-current");
  });
}

/**
 * function to activate highlight on a card link
 */
function highlightLink(card) {
  resetSideBar();
  const link = getSidebarLink(card);
  link.setAttribute("aria-current", "true");
}

/**
 * Function to create an IntersectionObserver that tracks which cards
 * are visible
 */
function createCardObserver(cardSelector, visibleCards, topNavHeight) {
  return new IntersectionObserver(
    (entries) => {
      // add the card to the visible set if the card is visible
      // else remove it from the set
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleCards.add(entry.target);
        } else {
          visibleCards.delete(entry.target);
        }
      });

      // find the first visible card
      const activeCard = [...document.querySelectorAll(cardSelector)].find(
        // Ken Yong code review: Removed trailing comma to satisfy the project's ESLint/Prettier configuration.
        (card) => visibleCards.has(card)
      );

      // highlight the link for the active card
      if (activeCard) {
        highlightLink(activeCard);
      }
    },
    // shrink root margin by top navbar height so card is highlighted when it reaches the
    // top of the content section of the page
    // shrink bottom rootmargin by half so a card does not trigger a highllight
    // until it enters top half of the screen
    // Ken Yong code review: Removed trailing comma to satisfy the project's ESLint/Prettier configuration.
    { rootMargin: `-${topNavHeight}px 0px -50% 0px` }
  );
}

/**
 * Function to track the cafe card being viewed on the page as user
 * scrolls
 */
// Ken Yong code review: I like this feature that using IntersectionObserver to tracks the visible cafe card and keeps the relevant sidebar link highlighted while scrolling.
export function trackActiveCard(cardSelector) {
  const topNavHeight = document.querySelector("header").offsetHeight; // get height of the top nav bar in px

  // track the visibility of the cards using IntersectionObserver
  const visibleCards = new Set();
  const observer = createCardObserver(cardSelector, visibleCards, topNavHeight);

  // observe all the cards
  const allCards = document.querySelectorAll(cardSelector);
  allCards.forEach((card) => observer.observe(card));
}
