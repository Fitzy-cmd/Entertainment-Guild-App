import "./stylesheets/ProductGrid.css";
import { getRandomProduct, getProductDetails } from "../helpers/GetAPI";
import ProductCard from "./ProductCard";
import React, { useState, useEffect } from 'react';

export default function ProductGrid({ rows, columns, products = [], useRandom = false }) {
    const totalDisplays = rows * columns; // Calculate total slots in the grid
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [error, setError] = useState(null); // Error state for handling errors

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "10px",
        width: "100%",
        height: "100%"
    };

    // Fetch random products if useRandom is true
    useEffect(() => {
        if (useRandom) {
            const fetchRandomProducts = async () => {
                try {
                    const promises = Array.from({ length: totalDisplays }, () => getRandomProduct());
                    const returnedProducts = await Promise.all(promises);
                    setDisplayedProducts(returnedProducts);
                } catch (error) {
                    console.error("Error fetching random products:", error);
                    setError("Failed to load random products.");
                    setDisplayedProducts([]); // Clear products on error
                }
            };
            fetchRandomProducts();
        }
    }, [useRandom, totalDisplays]);

    // Fetch details for provided product IDs when useRandom is false
    useEffect(() => {
        if (!useRandom && products.length > 0) {
            const fetchProductDetails = async () => {
                try {
                    const productDetails = await Promise.all(products.map(productID => getProductDetails(productID)));
                    setDisplayedProducts(productDetails);
                } catch (error) {
                    console.error("Error fetching product details:", error);
                    setError("Failed to load product details.");
                    setDisplayedProducts([]); // Clear products on error
                }
            };
            fetchProductDetails();
        }
    }, [products, useRandom]); // Dependencies ensure the effect runs when `products` or `useRandom` change

    // Generate placeholder cards if the number of products is less than the grid capacity
    const filledProducts = [...displayedProducts];
    if (filledProducts.length < totalDisplays) {
        const placeholders = Array(totalDisplays - filledProducts.length).fill(null);
        filledProducts.push(...placeholders);
    }

    return (
        <div className="master-grid-container">
            <div className="grid-container">
                {error ? (
                    <div style={{ display: "flex", justifyContent: "center", margin: "20rem" }}>
                        <h2>{error}</h2>
                    </div>
                ) : (
                    <div style={gridStyle}>
                        {filledProducts.map((product, index) => (
                            product ? (
                                <ProductCard
                                    key={index}
                                    title={product[0]?.Name || "Unknown Product"} // Fallback for missing data
                                    desc={product[0]?.Description || "No description available"}
                                    link={`/product?productID=${product[0]?.ID || "#"}`}
                                />
                            ) : (
                                <div key={index} className="product-placeholder"> {/* Placeholder for empty slots */}
                                    <h3></h3>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}