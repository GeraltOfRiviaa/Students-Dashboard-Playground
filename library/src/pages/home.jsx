import React, { useState, useEffect } from 'react'
import { ComboboxMultiple } from "@/components/comboboxMultiple";
import {GridViewIcon} from "@/components/icons/hugeicons-grid-view"
import {AppleReminderIcon} from "@/components/icons/hugeicons-apple-reminder"
import BooksCard from "@/components/booksCards"
import {getApiOptions, getEndpoint} from "../api"
import { useOutletContext } from 'react-router-dom';
import { useDebounce } from 'react-use';

const endpoint = getEndpoint()
const options = getApiOptions()

const Home = () => {
  const [genres, setGenres] = useState([])
  const [selected, setSelected] = useState([])
  const [genresError, setGenresError] = useState('')
  const [booksError, setBooksError] = useState('')
  const [books, setBooks] = useState([])
  const { searchTerm} = useOutletContext();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchGenres = async () => {
    const response = await fetch(endpoint + "/genres", options)
    return response.json()
  }

  const fetchBooks = async (query = '', genres = []) => {
  const params = new URLSearchParams()
  if (query) params.append('query', query)
  genres.forEach((g) => params.append('genres', g))

  const url = params.toString()
    ? `${endpoint}/search?${params.toString()}`
    : endpoint

  const response = await fetch(url, options)
  return response.json()
}

  useEffect(() => {
    let cancelled = false
    fetchBooks(debouncedSearchTerm, selected)
      .then((data) => { if (!cancelled) setBooks(data) })
      .catch((e) => {
        console.error(`Error fetching books: ${e}`)
        setBooksError('Error fetching books. Please try again later')
      })
    return () => { cancelled = true }
  }, [debouncedSearchTerm, selected])

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
      <div className="grid gap-3 justify-center grid-cols-[repeat(auto-fit,minmax(280px,20rem))]">
        {booksError
          ? <p>{booksError}</p>
          : books.map((book) => <BooksCard key={book._id} book={book}/>)}
      </div>
    </div>
  )
}
export default Home