import React from 'react'
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <Link to="/settings">Go to Settings</Link>
    </div>
  )
}

export default HomePage