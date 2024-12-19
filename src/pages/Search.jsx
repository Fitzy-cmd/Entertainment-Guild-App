import React, { useState, useEffect, useMemo } from 'react';
import ProductGrid from "../components/ProductGrid";
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterBox from "../components/FilterBox";
import { searchProducts } from '../helpers/GetAPI';

const Search = () => {
    const [response, setResponse] = useState([[], 0]); // Initialize as an array with products and count
    const [loading, setLoading] = useState(false); // Loading state for UX
    const [error, setError] = useState(null); // Error state for handling API errors
    const [page, setPage] = useState(1); // Current page state for future pagination
    const [maxProducts, setMaxProducts] = useState(0);
    const [reachedMaxProducts, setReachedMaxProducts] = useState(false)
    const [reachedMinProducts, setReachedMinProducts] = useState(true)

    // update styling of page navigation buttons based on availability
    useEffect(() => {
        if(page === 1) {
            setReachedMinProducts(true);
        } else {
            setReachedMinProducts(false);
        }
    }, [page])

    // Search params from the URL (query, category, subcategories)
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const category = searchParams.get('category') || 'books';
    const subcategories = useMemo(() => searchParams.get('subcategories')?.split(',') || [], [searchParams]);

    // Inline styling for layout
    const searchStyle = {
        display: "flex",
        flexDirection: "row",
        paddingTop: "4rem",
        paddingLeft: "5rem"
    };

    function addPage() {
        if (!(page * 9 + 9 > maxProducts)) { // ensures the page number can't exceed the max products
            setPage(prevPage => prevPage + 1);
        }
    }

    function subtractPage() {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    }

    const activeButton = {
        transition: "0.3s",
        backgroundColor: "#553F16",
        padding: "0.75rem 3.25rem",
        '&:hover': {
            backgroundColor: "#D59C36",
            cursor: "pointer"
        }
    }

    const inactiveButton = {
        backgroundColor: 'grey',
        padding: "0.75rem 3.25rem"
    }

    // useEffect to perform the search when dependencies change
    useEffect(() => {
        // Ensure async functions are wrapped inside the effect
        async function performSearch() {
            setLoading(true); // Indicate loading
            setError(null); // Reset error on new search
            try {
                const response = await getFromSearch({ query, category, subcategories, page });
                setResponse(response); // Set fetched products and count
                setMaxProducts(response[1]);
                if (!(page * 9 + 9 > maxProducts)) { // ensures the page number can't exceed the max products
                    setReachedMaxProducts(true); // Ensure
                } else {
                    setReachedMaxProducts(false);
                }
            } catch (err) {
                setError('Failed to fetch products. Please try again later.'); // Handle API errors gracefully
            } finally {
                setLoading(false); // Stop loading indicator
            }
        }

        // Only perform the search if there is a query or category
        if (query || category) {
            performSearch();
        }
    }, [query, category, subcategories, page]); // Re-run when these dependencies change

    useEffect(() => {
        setPage(1);
    }, [query, category, subcategories]);

    // Helper function to fetch products with error handling
    async function getFromSearch({ query, category, subcategories, page }) {
        try {
            const response = await searchProducts({ query, category, subcategories, currentPage: page });
            const products = response[0];
            const productCount = response[1];
            return [products, productCount];
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching products');
        }
    }

    const productsList = response[0]; // Extract products from response

    return (
        <>
            <div style={searchStyle}>
                <div>
                    <div style={{ display: 'flex', flexDirection: "row", padding: "0rem 1.5rem", justifyContent: "space-between" }}>
                        <div style={reachedMinProducts ? inactiveButton : activeButton} onClick={subtractPage}>❰</div>
                        <div style={{ fontSize: "2rem" }}>{page}</div>
                        <div
                            style={reachedMaxProducts ? activeButton : inactiveButton} onClick={addPage}>❱</div>
                    </div>
                    <FilterBox />
                </div>
                {loading ? (
                    <p>Loading products...</p> // Display loading indicator
                ) : error ? (
                    <p>{error}</p> // Display error message if error exists
                ) : (
                    <ProductGrid
                        rows={3}
                        columns={3}
                        products={productsList} // Pass products to the grid
                    />
                )}
            </div>
        </>
    );
}

export default Search;


