import React from 'react'
import logo from '../../assets/paint_brush_logo1.png'
import classes from './About.module.css'

function About() {
  return (
    <div className={classes.aboutContainer}>
      <img src={logo} alt='Palette Express Logo' />
      <h1>Palette Express</h1>
      <p className={classes.first2Para}>
        Welcome to Palette Express, your ultimate destination to unleash your
        creativity and connect with a diverse, vibrant community of artists and
        art enthusiasts. Our mission is to empower individuals to express
        themselves through their unique artistic talents, from traditional
        paintings and drawings to groundbreaking digital and AI-generated
        artwork.
      </p>
      <p className={classes.first2Para}>
        As an all-encompassing platform, Palette Express brings together
        creators from various backgrounds and styles, offering a space for them
        to showcase their masterpieces and discover the works of others. By
        fostering an environment of inspiration, collaboration, and
        appreciation, we aim to revolutionize the way artists and art lovers
        engage with each other.
      </p>
      <div className={classes.divider}>
        <h2>Features:</h2>
        <ul>
          <li>
            <strong>Diverse Art Categories:</strong> Embrace the full spectrum
            of artistic expression, including digital art, traditional
            paintings, illustrations, graphic designs, photography, and
            AI-generated artwork. There's a place for every artist on Palette
            Express.
          </li>
          <li>
            <strong>Personalized Portfolios:</strong> Create a stunning online
            portfolio that showcases your unique art style, allowing you to
            attract potential clients, collaborators, or simply share your work
            with friends and family.
          </li>
          <li>
            <strong>Interactive Community:</strong> Engage with fellow artists
            and art enthusiasts by liking, commenting, and sharing artwork.
            Build connections, exchange ideas, and find inspiration from a
            diverse and talented community.
          </li>
          <li>
            <strong>Advanced Search and Discovery:</strong> Easily search for
            and discover the artwork that speaks to you with our powerful search
            tools. Browse by category, style, or even by color palette to find
            the perfect piece.
          </li>
          <li>
            <strong>Inspiration Feed:</strong> Stay up-to-date with the latest
            trends, techniques, and styles in the art world by following your
            favorite artists and getting personalized recommendations.
          </li>
          <li>
            <strong>Collaborative Opportunities:</strong> Palette Express offers
            a platform for artists to collaborate on projects, share resources,
            and learn from one another to refine their skills and elevate their
            work.
          </li>
        </ul>
        <br />
        <p className={classes.lastPara}>
          Join Palette Express today and become a part of our thriving community
          that celebrates the beauty of creativity and self-expression. Embark
          on your artistic journey and let your imagination run free!
        </p>
      </div>
    </div>
  )
}

export default About
