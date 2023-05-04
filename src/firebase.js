// Import the functions you need from the SDKs you need
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { collection, getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDLAJbCfJ0v4h7-69X7ZoG14Vgjici3BRQ',
  authDomain: 'palette-express.firebaseapp.com',
  projectId: 'palette-express',
  storageBucket: 'palette-express.appspot.com',
  messagingSenderId: '505924927652',
  appId: '1:505924927652:web:a86869efe42e27bb15a631',
  measurementId: 'G-VZ6SZM3X0K',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)

const storage = getStorage(app)
const storageRef = ref(storage, 'gs://palette-express.appspot.com/default_pics')
const ImageLikes = collection(db, 'ImageLikes')
const followingRef = collection(db, 'Following')
const followersRef = collection(db, 'Followers')
const feedsRef = collection(db, 'Feeds')
const ImageMetadata = collection(db, 'ImageMetadata')
const imageData = collection(db, 'ImageData')
const imageDataUsers = collection(db, 'ImageData', 'users', 'uid')

export {
  storage,
  analytics,
  app,
  storageRef,
  ref,
  uploadBytes,
  auth,
  db,
  ImageLikes,
  followingRef,
  followersRef,
  feedsRef,
  ImageMetadata,
  imageData,
  imageDataUsers,
}
