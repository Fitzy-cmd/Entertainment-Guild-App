import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormGroup, FormControl, RadioGroup, Radio, FormControlLabel, Checkbox } from "@mui/material";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getFromGenre } from "../helpers/GetAPI";
import "./stylesheets/FilterBox.css";

export default function FilterBox() {
    const [filters, setFilters] = useState({
        category: "books",
        subcategories: [],
    });

    const [subcategories, setSubcategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Retrieve the searched term from search parameters, memoized to avoid unnecessary recalculations
    const searchedTerm = useMemo(() => searchParams.get('query'), [searchParams]);
    const loadedFilter = useMemo(() => searchParams.get('category') || "books", [searchParams]);

    // Updates the URL with the current filter settings
    const updateURL = useCallback((filters) => {
        const { category, subcategories } = filters;
        const queryParams = new URLSearchParams({
            query: searchedTerm || '',
            category,
            subcategories: subcategories.join(',')
        }).toString();
        navigate(`/search?${queryParams}`);
    }, [searchedTerm, navigate]);

    useEffect(() => {
        let isMounted = true; // Flag to ensure state updates only if the component is still mounted
        const requestNewSubcategories = async (category) => {
            try {
                const response = await getFromGenre(category);
                if (isMounted) setSubcategories(response || []); // Update subcategories if component is mounted
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        // Initialize filters based on loaded category from search parameters
        setFilters(prev => ({ ...prev, category: loadedFilter }));
        requestNewSubcategories(loadedFilter);

        // Cleanup function to prevent state updates if the component unmounts
        return () => {
            isMounted = false;
        };
    }, [loadedFilter]);

    // Handles category selection changes and updates filters accordingly
    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, category: value };
            updateURL(updatedFilters);
            requestNewSubcategories(value);
            return updatedFilters;
        });
    }, [updateURL]);

    // Handles changes in subcategory selection and updates filters
    const handleSubcategoryChange = useCallback((event) => {
        const { value, checked } = event.target;
        setFilters(prevFilters => {
            const updatedSubcategories = checked
                ? [...prevFilters.subcategories, value]
                : prevFilters.subcategories.filter(subcategory => subcategory !== value);

            const updatedFilters = { ...prevFilters, subcategories: updatedSubcategories };
            updateURL(updatedFilters);
            return updatedFilters;
        });
    }, [updateURL]);

    // Fetches new subcategories based on the selected category
    const requestNewSubcategories = async (category) => {
        try {
            const response = await getFromGenre(category);
            setSubcategories(response);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    return (
        <div className="top-inside">
            <div className="filters-container">
                {/* Category Filters */}
                <FormGroup component="fieldset">
                    <h3>Categories</h3>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="categories"
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="books" control={<Radio />} label="Books" />
                            <FormControlLabel value="games" control={<Radio />} label="Games" />
                            <FormControlLabel value="movies" control={<Radio />} label="Movies" />
                        </RadioGroup>
                    </FormControl>
                </FormGroup>

                {/* Subcategory Filters */}
                <FormGroup component="fieldset">
                    <h3>Subcategories</h3>
                    {subcategories.length > 0 ? (
                        subcategories.map(subcategory => (
                            <FormControlLabel
                                key={subcategory}
                                control={
                                    <Checkbox
                                        checked={filters.subcategories.includes(subcategory)}
                                        onChange={handleSubcategoryChange}
                                        value={subcategory}
                                    />
                                }
                                label={subcategory}
                            />
                        ))
                    ) : (
                        <p>No subcategories available.</p> // Feedback if no subcategories
                    )}
                </FormGroup>
            </div>
        </div>
    );
}
