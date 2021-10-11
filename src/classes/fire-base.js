import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
export class FireBase {
  static notConnected = true;

  static start() {
    const firebaseConfig = {
      apiKey: "AIzaSyA0s22zFalx9GTA_CX4Fov5l5q0qdZJZi8",
      authDomain: "joaovitorsw-pokedex.firebaseapp.com",
      projectId: "joaovitorsw-pokedex",
      storageBucket: "joaovitorsw-pokedex.appspot.com",
      messagingSenderId: "230418485778",
      appId: "1:230418485778:web:344b0570d44434ec37fecb",
      measurementId: "G-J36099809G",
    };
    const defaultProject = initializeApp(firebaseConfig);
  }
}
