import  {Button}  from "@/components/ui/button"
import  {BookOpen01Icon}  from "@/components/icons/hugeicons-book-open-01"
import  {Search01Icon}  from "@/components/icons/hugeicons-search-01"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between gap-10 p-2 shadow-sm">
        <div className="flex align-middle">
            <Link to="/" className="flex items-center gap-2">
                <BookOpen01Icon className="stroke-blue-600"/>
                <span className="font-bold">Library</span>
            </Link>
            
            
        </div>
        
        <div className="">
            <InputGroup className="max-w-xs">
                <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <Search01Icon/>
                    </InputGroupAddon>
            </InputGroup>
        </div>
    </div>
  )
}

export default Navbar