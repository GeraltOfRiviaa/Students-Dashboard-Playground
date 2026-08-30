"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"




export function ComboboxMultiple({genres, selected, setSelected}) {
  const anchor = useComboboxAnchor()

  if (genres.length === 0) {
    return (
      <div /*className="bg-white text-gray-600 flex items-center p-2 border border-gray-300 rounded-md size-auto"}*/>
        <Spinner/>
      </div>
    )
  }

  return (
    <Combobox
      selectionMode="multiple"
      autoHighlight
      value={selected}
      onChange={setSelected}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-xs">
        <ComboboxChipList>
          {(item) => <ComboboxChip id={item}>{item}</ComboboxChip>}
        </ComboboxChipList>
        <ComboboxChipsInput />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList items={genres}>
          {(item) => <ComboboxItem id={item}>{item}</ComboboxItem>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}