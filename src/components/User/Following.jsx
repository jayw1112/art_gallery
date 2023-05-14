import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchFollowing, fetchUser } from '../../utility/firebase.utils'
import { Link } from 'react-router-dom'
import classes from './Follow.module.css'
import person from '../../assets/person.svg'
import Spinner from '../UI/Spinner'

function Followers() {
  const { uid } = useParams()
  const [following, setFollowing] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFollowingData = async () => {
      setLoading(true)
      const fetchedFollowing = await fetchFollowing(uid)

      if (!fetchedFollowing || fetchedFollowing.length === 0) {
        setLoading(false)
        return
      }

      const fetchedUsers = await Promise.all(
        fetchedFollowing.map((followerId) => fetchUser(followerId))
      )
      setFollowing(fetchedUsers)
      setLoading(false)
    }
    fetchFollowingData()
  }, [uid])

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await fetchUser(uid)
      setUser(fetchedUser)
    }
    fetchUserData()
  }, [uid])

  return (
    <div className={classes.list}>
      <h2 className={classes.title}>
        {user ? `${user.displayName} is Following:` : 'Loading...'}
      </h2>
      <h3 className={classes.subTitle}>
        <Link to={`/followers/${uid}`}>Go To Followers</Link>
      </h3>
      <Link to={`/profile/${uid}`} className={classes.backLink}>
        Back to Profile
      </Link>

      {loading ? (
        <Spinner />
      ) : following.length > 0 ? (
        <div className={classes.scrollBox}>
          {following.map((follow, index) => (
            <div key={index} className={classes.listItem}>
              <Link className={classes.link} to={`/profile/${follow.userId}`}>
                <img
                  className={classes.profilePic}
                  src={follow.photoURL || person}
                  alt={follow.displayName}
                />
                <p className={classes.name}>{follow.displayName}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h2 className={classes.empty}>No Followers Found</h2>
      )}
    </div>
  )
}

export default Followers
