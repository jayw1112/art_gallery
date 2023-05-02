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

export const updateUserData = async (firestore, user, displayName, email) => {
  const userRef = doc(collection(firestore, 'users'), user.uid)

  try {
    await setDoc(
      userRef,
      {
        displayName,
        email,
        uid: user.uid,
        // Add any other information you want to update
      },
      { merge: true }
    )
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

export const updateFollowersFeeds = async (db, uid, imageId, metadata, url) => {
  try {
    console.log("Updating followers' feeds...") // Add this line

    // Get the followers of the user who uploaded the image
    const followersSnapshot = await getDocs(
      query(collection(db, 'Followers', uid, 'userFollowers'))
    )

    // Check if the user has any followers
    if (followersSnapshot.empty) {
      console.log('The user has no followers.')
      return
    }

    // Update the feed of each follower
    const promises = []
    followersSnapshot.forEach((followerDoc) => {
      const followerId = followerDoc.id
      const feedRef = doc(db, 'Feeds', followerId)
      const imageMetadataRef = doc(db, 'ImageMetadata', imageId)
      console.log(`Updating feed for follower: ${followerId}`)

      const setImageMetadata = async (url) => {
        await setDoc(imageMetadataRef, {
          url,
          title: metadata.customMetadata.title,
          description: metadata.customMetadata.description,
          owner: metadata.customMetadata.owner,
        })
      }

      setImageMetadata(url)

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
    console.log(`Updated feed for ${followersSnapshot.size} followers`)
  } catch (error) {
    console.log("Error updating followers' feeds:", error)
  }
}
