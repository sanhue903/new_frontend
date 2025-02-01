import React from 'react'
import styles from '../css/NavBar.module.css';
import LogoutButton from './LogoutButton'

function NavBar() {

  return (
    <div>
        <div className={styles.NavBar}>
            <LogoutButton />
        </div>
    </div>
  )
}

export default NavBar
