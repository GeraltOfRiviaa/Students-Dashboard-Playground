
import  {BookOpen01Icon}  from "@/components/icons/hugeicons-book-open-01"
import { Link } from "react-router-dom"
import Search from "./search"
import { useState } from 'react'

const Navbar = ({searchTerm, setSearchTerm}) => {


  return (
    <div className="flex flex-row justify-between gap-10 p-2 shadow-sm">
        <div className="flex align-middle">
            <Link to="/" className="flex items-center gap-2">
                <BookOpen01Icon className="stroke-blue-600"/>
                <span className="font-bold">Library</span>
            </Link>
            
            
        </div>
        
        <div className="">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>
    </div>
  )
}

export default Navbar