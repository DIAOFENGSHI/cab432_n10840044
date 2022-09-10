import React, { useState } from 'react';

export function SearchBar(props){
    const [innerSearch, setInnerSearch] = useState("");
    return(
        <div>
            <input
                aria-labelledby="search-stock-button"
                name="search-stock"
                id = "search-stock"
                type = "search"
                value = {innerSearch}
                placeholder = "enter book name..."
                onChange = {e => setInnerSearch(e.target.value)}
            >
            </input>
            <button
            id = "search-stock-button"
            type = "button"
            onClick = {() => {
                    props.onSubmit(innerSearch)
                }
            }
            >
                Search
            </button>
            <button
            id = "search-clear-button"
            type = "button"
            onClick = {() => {
                    props.onClear("")
                    setInnerSearch("");
                }
            }
            >
                Clear
            </button>
        </div>
    )
}