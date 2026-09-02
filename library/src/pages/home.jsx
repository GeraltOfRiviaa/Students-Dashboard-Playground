import React, { useState, useEffect } from 'react'
import { ComboboxMultiple } from "@/components/comboboxMultiple";
import {GridViewIcon} from "@/components/icons/hugeicons-grid-view"
import {AppleReminderIcon} from "@/components/icons/hugeicons-apple-reminder"
import BooksCard from "@/components/booksCards"

const endpoint = "http://127.0.0.1:8000/books"

const Home = () => {
  const [genres, setGenres] = useState([])
  const [selected, setSelected] = useState([])
  const [genresError, setGenresError] = useState('')
  const [booksError, setBooksError] = useState('')
  const [books, setBooks] = useState([])

  const fetchGenres = async () => {
    const response = await fetch(endpoint + "/genres", { method: "GET" })
    return response.json()
  }

  const fetchBooks = async () => {
    const response = await fetch(endpoint , { method: "GET" }) 
    return response.json()
  }

  useEffect(() => {
    let cancelled = false
    fetchBooks()
      .then((data) => { if (!cancelled) setBooks(data) })
      .catch((e) => {
        console.error(`Error fetching books: ${e}`)
        setBooksError('Error fetching books. Please try again later')
      })
    return () => { cancelled = true }
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
      .catch((e) => {
        console.error(`Error fetching genres: ${e}`)
        setGenresError('Error fetching genres. Please try again later')
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <div className='flex flex-row justify-between p-3'>
        {genresError
          ? <p>{genresError}</p>
          : <ComboboxMultiple genres={genres} selected={selected} setSelected={setSelected}/>}
        <div className="flex flex-row items-center gap-3">
          <GridViewIcon/>
          <AppleReminderIcon/>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {booksError
          ? <p>{booksError}</p>
          : books.map((book) => <BooksCard key={book.id} book={book}/>)}
      </div>
    </div>
  )
}
export default Home