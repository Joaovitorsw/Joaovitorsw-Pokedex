import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Observable } from "../classes/observable.js";
import { UtilsService } from "./utils.service.js";

export class FireBaseService {
  constructor() {
    this.login$ = new Observable();
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
      if (auth.currentUser) this.profile$?.publish(auth.currentUser);
    });
  }

  login(email, password) {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        UtilsService.notificationAlert("success", "Successful login");
        this.profile$.publish(auth.currentUser);
        this.login$.publish();
      })
      .catch(() => {
        UtilsService.notificationAlert("error", "Failed to login");
      });
  }

  register(name, email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const photo = require("../assets/images/pokemon-trainer-pokemon.svg");
        updateProfile(auth.currentUser, { displayName: name, photoURL: photo }).then(() => {
          UtilsService.notificationAlert("success", "Successful registration");
          this.login$.publish();
        });
      })
      .catch(() => {
        UtilsService.notificationAlert("error", "Failed to register");
      });
  }

  async updateProfile(name, email, password, newPassword, callback) {
    const auth = getAuth();
    const user = auth.currentUser;

    const credential = await EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
      .then(async () => {
        await updateEmail(user, email);
        await updateProfile(user, { displayName: name });
        await updatePassword(user, newPassword);
        callback();
        UtilsService.notificationAlert("success", "Profile updated");
      })
      .catch((error) => {
        UtilsService.notificationAlert("error", "Wrong Password");
      });
  }

  uploadFile(file) {
    const auth = getAuth();
    const storage = getStorage();
    const urlRef = ref(storage, `users/${auth.currentUser.uid}/profile2.jpg`);

    uploadBytes(urlRef, file).then(() => getDownloadURL(urlRef).then((imgUrl) => this.uploadImage(imgUrl)));
  }
  async addFavoritePokemon(pokemon) {
    const favoritesCollection = this.getFavoritePath();
    try {
      await addDoc(favoritesCollection, pokemon);
    } catch (error) {
      UtilsService.notificationAlert("error", `Error adding document:${error}`);
    }
  }

  async getFavoritesPokemons() {
    const favoritesCollection = this.getFavoritePath();
    const querySnapshot = await getDocs(favoritesCollection);
    return querySnapshot;
  }

  getFavoritePath() {
    const auth = getAuth();
    const db = getFirestore();
    const userCollectionReference = collection(db, "users");
    const userReference = doc(userCollectionReference, auth.currentUser?.uid);
    const favoritesCollection = collection(userReference, "favorites");
    return favoritesCollection;
  }

  async removeFavoritePokemon(pokemon) {
    const favoritesCollection = this.getFavoritePath();
    const querySnapshot = await getDocs(favoritesCollection);
    querySnapshot.forEach((document) => {
      const actuallyPokemonID = document.data().id;
      const isThePokemon = actuallyPokemonID !== pokemon.id;

      if (isThePokemon) return;

      const documentRef = doc(favoritesCollection, document.id);
      deleteDoc(documentRef);
    });
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
  }
}
