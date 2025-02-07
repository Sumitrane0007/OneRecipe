// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRpVyc3kL-o8rztVJxzWiHDbe67SGb6OM",
  authDomain: "recipe-21791.firebaseapp.com",
  projectId: "recipe-21791",
  storageBucket: "recipe-21791.firebasestorage.app",
  messagingSenderId: "437265777745",
  appId: "1:437265777745:web:7851ff7a4092f07b3d6470"
};

const app = initializeApp(firebaseConfig);


// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };