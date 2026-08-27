"use client"

import * as React from "react"
import getEndpoint from "../api"
import getApiOptions from "../api"
import { useEffect, useState} from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const setGenres = () => {
    try {
      const result = fetch(getEndpoint() + "genres", getApiOptions())
      if (result.length() === 0) {
        throw new Error("Could not find any genres")
      }
      const genres = await 

    } catch (error) {
      throw new Error("Error when fetching genres")
    }
  }

export function ComboboxMultiple() {
  const anchor = useComboboxAnchor()
  const [genres, setGenres] = useState([])

  useEffect(setGenres())
  
  
  return (
    <Combobox
      multiple
      autoHighlight
      items={genres}
      defaultValue={[genres[0]]}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-xs">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
