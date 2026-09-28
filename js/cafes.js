/**
 * Js for cafe recommendation webpage that
 * features sorting based on ratings and ratings
 * expressed as number of teacups.
 * Sidebar tracks the active card and highlights
 * the corresponding link
 */

import { getSidebarLink, trackActiveCard } from "./track-active.js";

const MAX_RATING = 5;

/**
 * function to create five teacup icons for a rating
 */
function createTeacups(rating) {
  const teacups = document.createElement("span"); // add container to hold the teacups
  teacups.className = "teacups";
  teacups.setAttribute("aria-hidden", "true"); //hide icons from screen readers
  //screen readers read from the ratings text

  // create one icon for each rating point
  for (let i = 0; i < MAX_RATING; i++) {
    const cup = document.createElement("span");
    cup.className = "teacup";
    // if i < rating, add teacup-filled class
    cup.classList.toggle("teacup-filled", i < rating);
    teacups.append(cup); // add the teacup to the container
  }
  return teacups; // return the container with the teacup icons
}

/**
 * hide the ratings-text visually, while retaining it for screen readers
 * handled here instead of in html so that the text is still available in the
 * case that the js fails to render the teacup icons
 */
function hideRatingText(dd) {
  const text = dd.querySelector(".ratings-text");
  text.classList.add("hide-text");
}

/** render icons for one rating */
function renderRating(dd) {
  const card = dd.closest(".cafe-card");
  const category = dd.dataset.category;
  const rating = Number(card.dataset[category]);

  const teacups = createTeacups(rating);
  dd.prepend(teacups); // add the teacups as first child of the dd element

  hideRatingText(dd); // hide the text
}

// build five teacup icons for each cafe rating and
function renderRatings() {
  document.querySelectorAll(".ratings dd[data-category]").forEach(renderRating);
}

/**
 * function to sort the cafe cards by rating
 */
function sortCards() {
  const select = document.querySelector("#sort-by");
  const container = document.querySelector(".page-content");
  const sidebarList = document.querySelector(".sidebar nav ul");
  const defaultOrder = [...container.querySelectorAll(".cafe-card")];

  // functioon to sort both the cards and the links on the sidebar
  function reorderCards(ratingCat) {
    const sorted = [...defaultOrder].sort(
      // for each pair of cards, a & b, selected by sort
      // rating b - rating a
      // if reault is +ve b goes before a
      // if result is -ve a goes before b
      // if result is 0 both are tied
      (a, b) => Number(b.dataset[ratingCat]) - Number(a.dataset[ratingCat]),
    );
    container.append(...sorted); // append the careds in the order of the sorting
    // map the cards to the sidebar list link (inclusive of <li>) and reorder them according to the sorted order
    sidebarList.append(
      ...sorted.map((card) => getSidebarLink(card).parentElement),
    );
  }

  // re-sort the cards whenever user selects a different ratings category
  select.addEventListener("change", () => reorderCards(select.value));
  reorderCards(select.value); // sort on page load
}

/**
 * Function to build an image carouse
 */
function buildCarousel(carousel) {
  const images = [...carousel.querySelectorAll(".carousel-photo img")];
  const prevButton = carousel.querySelector(".prev-photo");
  const nextButton = carousel.querySelector(".next-photo");

  /**
   * if only one photo is available, hide the previous and next buttons
   */
  if (images.length < 2) {
    prevButton.hidden = true;
    nextButton.hidden = true;
    return;
  }

  let current = 0;
  // function to update the photo when left/right button code is clicked
  // buttonCode is a number that represents the button that was clicked
  // left=-1 right=1
  function updatePhoto(buttonCode) {
    // compute the index of the current photo to be displayed
    current = (current + buttonCode + images.length) % images.length;

    images.forEach((img, i) => {
      img.hidden = i !== current; // hide the images that are not the current image
    });
  }

  prevButton.addEventListener("click", () => updatePhoto(-1));
  nextButton.addEventListener("click", () => updatePhoto(1));
  updatePhoto(0); // display the first image
}

/**
 * function to build all carousels
 */
function buildCarousels() {
  document.querySelectorAll(".carousel").forEach(buildCarousel);
}

/**
 * function to call all functions for the page in order
 */
function init() {
  buildCarousels();
  renderRatings();
  sortCards();
  trackActiveCard(".cafe-card");
}

init();
