import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchFollowers, fetchUser } from '../../utility/firebase.utils'
import { Link } from 'react-router-dom'
import classes from './Follow.module.css'
import person from '../../assets/person.svg'
import Spinner from '../UI/Spinner'

function Followers() {
  const { uid } = useParams()
  const [followers, setFollowers] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFollowersData = async () => {
      setLoading(true)
      const fetchedFollowers = await fetchFollowers(uid)

      if (fetchedFollowers.length === 0) {
        setLoading(false)
        return
      }

      const fetchedUsers = await Promise.all(
        fetchedFollowers.map((followerId) => fetchUser(followerId))
      )
      setFollowers(fetchedUsers)
      setLoading(false)
    }
    fetchFollowersData()
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
        {user ? `${user.displayName}'s Followers:` : 'Loading...'}
      </h2>
      <h3 className={classes.subTitle}>
        <Link to={`/following/${uid}`}>Go To Following</Link>
      </h3>
      <Link to={`/profile/${uid}`} className={classes.backLink}>
        Back to Profile
      </Link>
      {loading ? (
        <Spinner />
      ) : followers.length > 0 ? (
        <div className={classes.scrollBox}>
          {followers.map((follower, index) => (
            <div key={index} className={classes.listItem}>
              <Link className={classes.link} to={`/profile/${follower.userId}`}>
                <img
                  className={classes.profilePic}
                  src={follower.photoURL || person}
                  alt={follower.displayName}
                />
                <p className={classes.name}>{follower.displayName}</p>
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
