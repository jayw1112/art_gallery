import React, { useState, useEffect, useRef } from 'react'
import ImageCard from '../GalleryUI/ImageCard'
import { Link } from 'react-router-dom'
import Spinner from '../UI/Spinner'
import {
  collection,
  //   doc,
  //   getDoc,
  getDocs,
  query,
  where,
  //   orderBy,
  //   startAt,
  //   endAt,
} from 'firebase/firestore'

import { db, ref, storage } from '../../firebase'
import classes from './Search.module.css'
import { getDownloadURL, getMetadata, listAll } from 'firebase/storage'
// Import necessary firebase functions and references

function Search() {
  const [searchResults, setSearchResults] = useState([])
  const [searchType, setSearchType] = useState('users')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      if (searchTerm) {
        try {
          let searchCollection
          let searchQuery
          const results = []

          if (searchType === 'users') {
            searchCollection = collection(db, 'users')
            searchQuery = query(
              searchCollection,
              where('displayName', '==', searchTerm)
            )
            const querySnapshot = await getDocs(searchQuery)
            querySnapshot.forEach((doc) => {
              results.push({ ...doc.data(), id: doc.id })
            })
            setSearchResults(results)
            console.log('User search results:', results)
          } else {
            // searchCollection = collection(db, 'ImageMetadata')
            // searchQuery = query(
            //   searchCollection,
            //   where('title', '==', searchTerm)
            // )
            // const querySnapshot = await getDocs(searchQuery)
            // querySnapshot.forEach((doc) => {
            //   console.log('Image document data:', doc.data()) // Log the data for debugging purposes
            //   results.push({ ...doc.data(), id: doc.id })
            // })

            const usersListRef = ref(storage, 'users')
            const usersListRes = await listAll(usersListRef)
            const searchPromises = usersListRes.prefixes.map(
              async (userFolderRef) => {
                const imagesListRes = await listAll(userFolderRef)
                const imagePromises = imagesListRes.items.map(
                  async (imageRef) => {
                    const metadata = await getMetadata(imageRef)
                    if (
                      metadata.customMetadata &&
                      (metadata.customMetadata.title.toLowerCase() ===
                        searchTerm.toLowerCase() ||
                        (searchTerm.length >= 3 &&
                          metadata.customMetadata.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())))
                    ) {
                      const url = await getDownloadURL(imageRef)
                      return {
                        ...metadata.customMetadata,
                        url,
                        id: imageRef.name,
                        ownerId: userFolderRef.name,
                      }
                    }
                  }
                )

                const imagesData = await Promise.all(imagePromises)
                return imagesData.filter((imageData) => imageData !== undefined)
              }
            )

            const results = (await Promise.all(searchPromises)).flat()
            setSearchResults(results)

            console.log('Image search results:', results)
          }
        } catch (error) {
          console.log('Error fetching search results:', error)
        }
      }
      setIsLoading(false)
    }

    fetchSearchResults()
  }, [searchTerm, searchType])

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value)
    setSearchTerm('') // Clear the input
    setSearchResults([]) // Clear search results
    inputRef.current.focus() // Focus on the input
  }

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    console.log('Search term:', searchTerm)
    console.log('Search type:', searchType)
  }

  return (
    <div className={classes.searchContainer}>
      <form onSubmit={handleSearch}>
        <input
          ref={inputRef}
          type='text'
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder='Search'
        />
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value='users'>Users</option>
          <option value='images'>Images</option>
        </select>
        <button type='submit'>Search</button>
      </form>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div
          className={
            searchType === 'users'
              ? classes.userSearchResults
              : classes.imagesGrid
          }
        >
          {searchResults.map((result) => {
            if (searchType === 'users') {
              return (
                <Link
                  className={classes.link}
                  key={result.id}
                  to={`/profile/${result.id}`}
                >
                  {result.displayName}
                </Link>
              )
            } else {
              return (
                <div className={classes.imageContainer} key={result.id}>
                  <ImageCard
                    key={result.id}
                    image={result.url}
                    title={result.title}
                    description={result.description}
                    imageId={result.id}
                    owner={result.owner}
                    displayLink={true}
                    className={classes.image}
                  />
                  <Link
                    className={classes.link2}
                    key={result.id}
                    to={`/profile/${result.owner}`}
                  >
                    Go To Profile
                  </Link>
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default Search
