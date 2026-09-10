import React from 'react'
import  {Search01Icon}  from "@/components/icons/hugeicons-search-01"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useNavigate, useLocation } from "react-router-dom"


const Search = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && location.pathname !== "/") {
      navigate("/")
    }
  }

  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
        placeholder="Search for a book"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon>
        <Search01Icon />
      </InputGroupAddon>
    </InputGroup>
  )
}
export default Search