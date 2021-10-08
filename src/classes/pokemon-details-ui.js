import { Utils } from "./utils.js";

export class PokemonDetailsUI {
  static UI() {
    PokemonDetailsUI.tabsUI();
    PokemonDetailsUI.shinyForm();
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
  static shinyForm() {
    const $shinyContent = document.querySelector(".shiny-content");

    const $pokeImage = document.querySelector(".pokemon-image");
    const $pokeFirstForm = document.querySelectorAll(".first-form img");
    const $pokeSecondForm = document.querySelectorAll(".second-form img");

    $shinyContent.addEventListener("click", shinyForm);

    function shinyForm() {
      $pokeImage.classList.toggle("shinyForm");

      if ($pokeImage.className === "pokemon-image") {
        $pokeImage.setAttribute("src", Utils.getPokeImageUrl($pokeImage.dataset.name));

        $pokeFirstForm.forEach((img) => {
          const pokemonName = img.dataset.name;
          img.setAttribute("src", Utils.getPokeImageUrl(pokemonName));
        });

        $pokeSecondForm.forEach((img) => {
          const pokemonName = img.dataset.name;
          img.setAttribute("src", Utils.getPokeImageUrl(pokemonName));
        });
      } else {
        $pokeImage.setAttribute("src", Utils.getPokeImageUrl($pokeImage.dataset.name, true));

        $pokeFirstForm.forEach((img) => {
          const pokemonName = img.dataset.name;
          img.setAttribute("src", Utils.getPokeImageUrl(pokemonName, true));
        });

        $pokeSecondForm.forEach((img) => {
          const pokemonName = img.dataset.name;
          img.setAttribute("src", Utils.getPokeImageUrl(pokemonName, true));
        });
      }
    }
  }
}
