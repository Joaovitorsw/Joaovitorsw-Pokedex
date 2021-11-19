import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Observable } from "../classes/observable.js";
import { UtilsService } from "./utils.service.js";

export class FireBaseService {
  notConnected;
  userName;
  userPhotoUrl;
  #loginScreenService;

  constructor(loginScreenService) {
    this.#loginScreenService = loginScreenService;
    this.profile$ = new Observable();
  }

  start() {
    const firebaseConfig = {
      apiKey: "AIzaSyA0s22zFalx9GTA_CX4Fov5l5q0qdZJZi8",
      authDomain: "joaovitorsw-pokedex.firebaseapp.com",
      projectId: "joaovitorsw-pokedex",
      storageBucket: "joaovitorsw-pokedex.appspot.com",
      messagingSenderId: "230418485778",
      appId: "1:230418485778:web:344b0570d44434ec37fecb",
      measurementId: "G-J36099809G",
    };
    this.app = initializeApp(firebaseConfig);
    this.hasLogin();
  }

  getUser() {
    const auth = getAuth();
    return auth.currentUser;
  }

  hasLogin() {
    const auth = getAuth();
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        this.profile$.publish(auth.currentUser);
        this.getFavoritesPokemons();
      }
    });
  }

  login(email, password) {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        UtilsService.notificationAlert("success", "Successful login");
        this.profile$.publish(auth.currentUser);
        this.#loginScreenService.removeScreen();
      })
      .catch(() => {
        UtilsService.notificationAlert("error", "Failed to login");
      });
  }

  register(name, email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        UtilsService.notificationAlert("success", "Successful registration");
        updateProfile(auth.currentUser, { displayName: name }).then(() => {
          const $profile = document.querySelector("profile-card");
          const photo = require("../assets/images/pokemon-trainer-pokemon.svg");
          $profile.update(auth.currentUser.displayName, photo);
        });
        this.#loginScreenService.removeScreen();
      })
      .catch(() => {
        UtilsService.notificationAlert("error", "Failed to register");
      });
  }

  updateProfile(name) {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        UtilsService.notificationAlert("success", "Profile updated");
        const $profile = document.querySelector("profile-card");
        $profile.update(auth.currentUser.displayName);
      })
      .catch(() => {
        UtilsService.notificationAlert("error", "An error occurred");
      });
  }

  uploadFile(file) {
    const auth = getAuth();
    const storage = getStorage();
    const urlRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);

    uploadBytes(urlRef, file).then(() => getDownloadURL(urlRef).then((imgUrl) => this.uploadImage(imgUrl)));
  }
  async addFavoritePokemon(pokemon) {
    const auth = getAuth();
    const db = getFirestore();
    const userCollectionReference = collection(db, "users");
    const userReference = doc(userCollectionReference, auth.currentUser.uid);
    const favoritesCollection = collection(userReference, "favorites");

    try {
      await addDoc(favoritesCollection, pokemon);
    } catch (error) {
      alert(`Error adding document:${error}`);
    }
  }

  async getFavoritesPokemons() {
    const favoritesCollection = this.getFavoritePath();
    const querySnapshot = await getDocs(favoritesCollection);
    querySnapshot.forEach((doc) => {
      const pokemon = doc.data();
      const $allCards = document.querySelectorAll("pokemon-card");
      $allCards.forEach(($card) => {
        if ($card.pokemonID === pokemon.id) {
          const favPokemons = $card.querySelector("fav-star");
          favPokemons.querySelector(".fav-content").classList.add("active");
        }
      });
    });
    const favPage = document.querySelector(".selected h1").innerText === "Favorite Pokemons";

    if (favPage) {
      const $favStars = document.querySelectorAll("fav-star");
      $favStars.forEach(($star) => {
        $star.observable$.subscribe((boolean) => {
          const $pokemonCard = $star.parentElement.parentElement;
          const $pokemonContent = $pokemonCard.parentElement;
          const pokemonCardList = $pokemonContent.querySelectorAll("pokemon-card");

          if (!boolean) $pokemonCard.remove();

          if (pokemonCardList.length === 1) {
            $pokemonContent.classList.add("search-error");
            const $errorCard = UtilsService.createElementWithClass("div", "search-error");
            $errorCard.innerHTML = `   
            <h1>sorry</h1>
            <img>
            <p>Pokemon not found</p>
            `;
            UtilsService.fade($errorCard);
            $pokemonContent.append($errorCard);
            return;
          }
        });
      });
    }

    return querySnapshot;
  }

  getFavoritePath() {
    const auth = getAuth();
    const db = getFirestore();
    const userCollectionReference = collection(db, "users");
    const userReference = doc(userCollectionReference, auth.currentUser.uid);
    const favoritesCollection = collection(userReference, "favorites");
    return favoritesCollection;
  }

  async removeFavoritePokemon(pokemon) {
    const favoritesCollection = this.getFavoritePath();
    const querySnapshot = await getDocs(favoritesCollection);
    querySnapshot.forEach((document) => {
      const actuallyPokemonID = document.data().id;
      const isThePokemon = actuallyPokemonID === pokemon.id;
      const documentRef = doc(favoritesCollection, document.id);
      if (isThePokemon) return deleteDoc(documentRef);
    });
  }

  removeStars() {
    const stars = document.querySelectorAll(".fav-content");
    stars.forEach((star) => star.classList.remove("active"));
    const menu = document.querySelector("menu-gen");
    const selected = document.querySelector(".selected h1");
    menu.selectOption$.publish({ start: 0, end: 898 });
    selected.innerHTML = "Filter by Generation";
  }

  uploadImage(url) {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      photoURL: url,
    })
      .then(() => {
        UtilsService.notificationAlert("success", "Profile updated!");
        this.hasLogin();
      })
      .catch(() => UtilsService.notificationAlert("error", "An error occurred"));
  }

  logoff() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        UtilsService.notificationAlert("warning", "Sign-out successful");
      })
      .catch((error) => {
        UtilsService.notificationAlert("error", "An error happened");
      });
    this.removeStars();
  }
}
