import React, { useState, useEffect } from 'react'
import ImageCard from '../GalleryUI/ImageCard'
import { Link } from 'react-router-dom'
import Spinner from '../UI/Spinner'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase'
import classes from './Search.module.css'
// Import necessary firebase functions and references

function Search() {
  const [searchResults, setSearchResults] = useState([])
  const [searchType, setSearchType] = useState('users')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
            console.log('User search results:', results)
          } else {
            searchCollection = collection(db, 'ImageMetadata')
            const searchQueryTitle = query(
              searchCollection,
              where('title', '==', searchTerm)
            )
            const searchQueryDescription = query(
              searchCollection,
              where('description', 'array-contains', searchTerm)
            )
            const querySnapshotTitle = await getDocs(searchQueryTitle)
            const querySnapshotDescription = await getDocs(
              searchQueryDescription
            )
            querySnapshotTitle.forEach((doc) => {
              results.push({ ...doc.data(), id: doc.id })
            })
            querySnapshotDescription.forEach((doc) => {
              if (!results.some((result) => result.id === doc.id)) {
                results.push({ ...doc.data(), id: doc.id })
              }
            })
            console.log('Image search results:', results)
          }
          setSearchResults(results)
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
          type='text'
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value='users'>Users</option>
          <option value='images'>Images</option>
        </select>
        <button type='submit'>Search</button>
      </form>
      {isLoading && <Spinner />}
      {!isLoading &&
        searchResults.map((result) => {
          if (searchType === 'users') {
            return (
              <Link key={result.id} to={`/profile/${result.id}`}>
                {result.displayName}
              </Link>
            )
          } else {
            return (
              <ImageCard
                key={result.id}
                image={result.image}
                title={result.title}
                description={result.description}
                imageId={result.id}
                ownerId={result.owner}
              />
            )
          }
        })}
    </div>
  )
}

export default Search
