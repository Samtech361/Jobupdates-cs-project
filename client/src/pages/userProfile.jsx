import {Link} from 'react'
import { NavLink } from 'react-router-dom'

function userProfile() {
  return (
    <div>
      <h1>
        Upload Resume
      </h1>
      <button><NavLink to='/upload'></NavLink></button>
    </div>
  )
}

export default userProfile