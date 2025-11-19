import { addBugButton } from "./bugButton.js";
import { createNavigation } from "./createNavigation.js";
import { initZoomAndPan } from "./zoomAndPan.js";
import { titleCase } from "./forceTitleCase.js";

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById('back-button');

  backButton.addEventListener('click', () => {
    var atlasHome = "https://atlas.aplusfcu.org/";
    if (document.referrer && document.referrer.startsWith(atlasHome)) {
      window.history.back();
    } else {
      window.location.href = atlasHome;
    }
  });

  addBugButton();
  createNavigation();
  initZoomAndPan();
  // titleCase();
});