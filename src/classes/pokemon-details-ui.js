import { Utils } from "./utils.js";

export class PokemonDetailsUI {
  static UI() {
    PokemonDetailsUI.tabsUI();
    PokemonDetailsUI.shinyForm();
    PokemonDetailsUI.sortTable();
  }

  static tabsUI() {
    let currentSlideIndex;

    const $tabs = document.querySelectorAll(".tab");
    const $options = document.querySelectorAll(".tab-option");

    $options.forEach(($option) => {
      const optionIndex = $option.dataset.value;
      $option.addEventListener("click", () => currentSlide(optionIndex));
    });

    function currentSlide(index) {
      showSlides((currentSlideIndex = index));
    }

    function showSlides(currentIndex) {
      hideSlides();
      removeActiveClass();
      $tabs[currentSlideIndex].classList.add("active");
      $options[currentSlideIndex].classList.add("active");
    }

    function removeActiveClass() {
      $options.forEach(($option) => {
        $option.classList.remove("active");
      });
    }

    function hideSlides() {
      $tabs.forEach(($tab) => {
        $tab.classList.remove("active");
      });
    }
  }
}
