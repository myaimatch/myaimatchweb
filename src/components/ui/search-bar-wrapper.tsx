"use client"

import { SearchBar } from "./search-bar"

export function SearchBarWrapper() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white text-center">Find AI tools for your workflow...</h2>
      <SearchBar placeholder="I'm a designer / marketer / developer..." />
    </div>
  )
}
