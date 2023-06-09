import { ref } from 'firebase/storage'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '../firebase'

export const getUserStorageRef = (storage, uid) => {
  if (uid) {
    return ref(storage, `users/${uid}`)
  }
  return null
}

export function getPicStorageRef(storage, userId, fileName) {
  return ref(storage, `profilePics/${userId}/${fileName}`)
}

export const getImageStorageRef = (storage, uid, imageId, ownerId) => {
  if (ownerId && imageId) {
    return ref(storage, `users/${ownerId}/${imageId}`)
  }
  if (uid && imageId) {
    return ref(storage, `users/${uid}/${imageId}`)
  }
  // Throw an error or return null if both uid and ownerId are missing
  console.error('Both uid and ownerId are missing.')
  return null
}

export const storeUserData = async (firestore, user, displayName) => {
  const userRef = doc(collection(firestore, 'users'), user.uid)

  try {
    await setDoc(userRef, {
      displayName,
      email: user.email,
      uid: user.uid,
      // Add any other information you want to store
    })

    const feedRef = doc(collection(firestore, 'Feeds'), user.uid)

    await setDoc(feedRef, {
      images: [],
    })

    console.log('User data stored successfully!')
  } catch (error) {
    console.log('Error storing user data:', error)
  }
}

export const updateUserData = async (
  firestore,
  user,
  displayName,
  email,
  photoURL,
  profileInfo
) => {
  const userRef = doc(collection(firestore, 'users'), user.uid)

  try {
    await setDoc(
      userRef,
      {
        displayName,
        email,
        uid: user.uid,
        photoURL,
        profileInfo,
        // Add any other information you want to update
      },
      { merge: true }
    )
    console.log('photoURL:', photoURL)
    console.log('User data updated successfully!')
  } catch (error) {
    console.log('Error updating user data:', error)
  }
}

export const fetchUserName = async (uid) => {
  const userDocRef = doc(db, 'users', uid)
  try {
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.displayName
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.log('Error fetching user data:', error)
    return null
  }
}

export const fetchUser = async (uid) => {
  const userDocRef = doc(db, 'users', uid)
  try {
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        displayName: userData.displayName,
        userId: userData.uid,
        profileInfo: userData.profileInfo,
        photoURL: userData.photoURL,
        email: userData.email,
      }
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.log('Error fetching user data:', error)
    return null
  }
}

export const updateFollowersFeeds = async (db, uid, imageId, metadata, url) => {
  try {
    console.log("Updating followers' feeds...")

    const setImageMetadata = async (imageMetadataRef, url, metadata) => {
      await setDoc(imageMetadataRef, {
        ...metadata.customMetadata,
        url,
        // title: metadata.customMetadata.title,
        // description: metadata.customMetadata.description,
        // owner: metadata.customMetadata.owner,
        // createdAt: metadata.customMetadata.createdAt,
        path: metadata.customMetadata.path,
      })
    }

    // Get the followers of the user who uploaded the image
    const followersDocRef = doc(db, 'Followers', uid)
    const followersDoc = await getDoc(followersDocRef)

    // Check if the user has any followers
    if (
      !followersDoc.exists() ||
      !followersDoc.data().followers ||
      followersDoc.data().followers.length === 0
    ) {
      console.log('The user has no followers.')
      return
    }

    const followersArray = followersDoc.data().followers

    // Update the feed of each follower
    const promises = []
    followersArray.forEach((followerId) => {
      const feedRef = doc(db, 'Feeds', followerId)
      const imageMetadataRef = doc(db, 'ImageMetaData', imageId)
      console.log(`Updating feed for follower: ${followerId}`)

      setImageMetadata(imageMetadataRef, url, metadata)

      const promise = setDoc(
        feedRef,
        {
          images: arrayUnion(imageId),
        },
        { merge: true }
      )

      promises.push(promise)
    })

    // Wait for all updates to complete
    await Promise.all(promises)
    console.log(`Updated feed for ${followersArray.length} followers`)
  } catch (error) {
    console.log("Error updating followers' feeds:", error)
  }
}

// Create User Document

const createUserDocument = async (user, username) => {
  if (!user) return

  const userRef = doc(db, `users/${user.uid}`)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    const { email, photoURL } = user
    const displayName = username || user.displayName
    const createdAt = new Date()

    try {
      await setDoc(userRef, {
        displayName: username,
        email,
        photoURL,
        createdAt,
        profileInfo: '',
        uid: user.uid,
        // Add any additional fields you'd like to store for each user
      })
    } catch (error) {
      console.error('Error creating user document', error)
    }
  }

  return userRef
}

export default createUserDocument

// Fetch Followers data
export const fetchFollowers = async (uid) => {
  const followersDocRef = doc(db, 'Followers', uid)
  try {
    const followersDoc = await getDoc(followersDocRef)
    if (followersDoc.exists()) {
      const followersData = followersDoc.data()
      return followersData.followers
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.log('Error fetching followers data:', error)
    return null
  }
}

// Fetch Following data
export const fetchFollowing = async (uid) => {
  const followingDocRef = doc(db, 'Following', uid)
  try {
    const followingDoc = await getDoc(followingDocRef)
    if (followingDoc.exists()) {
      const followingData = followingDoc.data()
      return followingData.following
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.log('Error fetching following data:', error)
    return null
  }
}

export function handleFirebaseError(error) {
  const errorCode = error.code
  let errorMessage

  switch (errorCode) {
    case 'auth/invalid-password':
      errorMessage = 'Incorrect password.'
      break

    case 'auth/invalid-email':
      errorMessage = 'Invalid email.'
      break
    case 'auth/user-disabled':
      errorMessage = 'This user account has been disabled.'
      break
    case 'auth/user-not-found':
      errorMessage = 'No user found with this email.'
      break
    case 'auth/email-already-exists':
      errorMessage = 'Email already exists.'
      break

    default:
      errorMessage = 'Invalid password/email.'
      break
  }
  return errorMessage
}
