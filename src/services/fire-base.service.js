import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
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
    initializeApp(firebaseConfig);
    this.hasLogin();
  }

  hasLogin() {
    const auth = getAuth();
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        this.profile$.publish(auth.currentUser);
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

  async uploadFile(file) {
    const auth = getAuth();
    const storage = getStorage();
    const urlRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);

    await uploadBytes(urlRef, file).then(() => UtilsService.notificationAlert("success", "Upload File"));
    await setTimeout(() => getDownloadURL(urlRef).then((imgUrl) => FireBaseService.uploadImage(imgUrl)), 1500);
  }

  uploadImage(url) {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      photoURL: url,
    })
      .then(() => UtilsService.notificationAlert("success", "Profile updated!"))
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
  }
}
