import React from 'react'
import { ComboboxMultiple } from "@/components/comboboxMultiple";
import {GridViewIcon} from "@/components/icons/hugeicons-grid-view"
import {AppleReminderIcon} from "@/components/icons/hugeicons-apple-reminder"
import BooksCard from "@/components/booksCards"
import EmptyCard from '@/components/emptyCard'
import {useState, useEffect} from 'react'

const endpoint = import.meta.env.VITE_ENDPOINT


const Home = () => {
  
  const [genres, setGenres] = useState([])
  const [selected, setSelected] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [books, setBooks] = useState([])

  
const fetchGenres = async () => {
  try{
    const response = await fetch(endpoint + "/genres", { method: "GET" })

  }catch{
    throw new Error("Failed to fetch genres")
    setErrorMessage('Error fetching genres.Please try again later')
  }
  return response.json()
}

  useEffect(() => {
    fetchBooks()
      .then((data) => {
          setBooks(data)
      })
      .catch((e) => console.error(`Error fetching books: ${e}`))
      .finaly(() => <EmptyCard/>)
    
  }, [])
  useEffect(() => {
    let cancelled = false
    fetchGenres()
      .then((data) => {
        if (!cancelled) {
          setGenres(data)
          setSelected(data.length ? [data[0]] : [])
        }
      })
      .catch((e) => console.error(`Error fetching genres: ${e}`))
    return () => { cancelled = true }
  }, [])


  return (
    <div>
      <div className='flex flex-row justify-between p-3'>
        <ComboboxMultiple genres={genres} selected={selected} setSelected={setSelected}/>
        <div className="flex flex-row items-center gap-3">
          <GridViewIcon/>
          <AppleReminderIcon/>
        </div>
      </div>
      <div className="pt-3 px-3">
        {/*<BooksCard/>*/}
      </div>
    </div>
      
      
  )
}
export default Home