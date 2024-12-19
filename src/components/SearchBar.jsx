import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import CustomLink from "./CustomLink";
import "./stylesheets/SearchBar.css";

export default function SearchBar() {
    const [input, setInput] = useState("");
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Update the query parameter
    const handleSearch = () => {
        // Set the query parameter to the input value
        const params = new URLSearchParams(searchParams); // Create a new URLSearchParams instance
        params.set('query', input); // Set the new query parameter
        return `?${params.toString()}`; // Return the updated query string
    };

    // Determine the correct URL to pass to CustomLink
    const to = location.pathname === "/search"
        ? handleSearch() // Update query only if on search page
        : `/search?${handleSearch().slice(1)}`; // Redirect to search page with query

    return (
        <div className="search-wrapper">
            <input 
                placeholder="Search..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
            />
            <CustomLink
                to={to} // Use the determined URL
                className={input ? '' : 'disabled'}>
                <FaSearch id="search-icon" />
            </CustomLink>
        </div>
    );
}
