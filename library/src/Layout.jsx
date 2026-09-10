import React from 'react'
import Navbar from './components/navbar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
    <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    <main>
        <Outlet context={{searchTerm }}/>
    </main>
    </div>
  )
}

export default Layout