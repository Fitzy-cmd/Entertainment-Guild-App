import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductDetails, getSourceFromID, getSubcategoryMappings } from '../helpers/GetAPI';
import StylisedRadio from "./StylisedRadio";
import { CartContext } from "../helpers/CartContext";
import "./stylesheets/ProductDisplay.css";

const ProductDisplay = () => {
    const [searchParams] = useSearchParams();
    const [genre, setGenre] = useState("");
    const [subGenre, setSubGenre] = useState("");
    const productID = searchParams.get('productID');

    const { addToCart: addToCartContext } = useContext(CartContext);

    // State to store the product details and user-selected options
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [options, setOptions] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(0); // Default selection index
    const [error, setError] = useState(null); // Error handling state

    // Increment the product quantity by one
    function addQuantity() {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    // Decrement the product quantity by one, ensuring it doesn't go below 1
    function subtractQuantity() {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    }
    
    // Fetch product details by product ID
    async function retrieveProductDetails(productID) {
        try {
            const product = await getProductDetails(productID);
            return product[0];
        } catch (error) {
            console.error("Error retrieving product details:", error);
            throw error;
        }
    }
    
    // Format the date into a human-readable string
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Retrieve the subgenre name based on its ID
    function getSubgenreName(subgenreID, subcategoryMappings) {
        for (const [name, id] of Object.entries(subcategoryMappings)) {
            if (id === subgenreID) {
                return name;
            }
        }
        return "Unknown Subgenre";
    }

    useEffect(() => {
        // Fetch product details and available options when the product ID changes
        async function fetchProductAndOptions() {
            try {
                if (productID) {
                    const retrievedProduct = await retrieveProductDetails(productID);
                    setProduct(retrievedProduct);

                    setGenre(retrievedProduct?.Genre1?.Name || "Unknown Genre");

                    const subcategoryMappings = await getSubcategoryMappings(retrievedProduct.Genre);
                    const subgenreName = getSubgenreName(retrievedProduct?.SubGenre, subcategoryMappings);
                    setSubGenre(subgenreName);

                    const stocktakeList = retrievedProduct["Stocktake List"] || [];
                    if (stocktakeList.length > 0) {
                        const result = await getSourceFromID(stocktakeList);
                        setOptions(result);
                    } else {
                        setOptions([]);
                    }
                }
            } catch (err) {
                console.error("Error fetching product or options:", err);
                setError("Failed to load product details.");
            }
        }
    
        fetchProductAndOptions();
    }, [productID]);

    // Add the selected product and its variation to the shopping cart
    function addToCart() {
        if (product && selectedVariation !== null && options[selectedVariation]) {
            const selectedSource = options[selectedVariation]; // Retrieve the selected source for the variation
            addToCartContext(product.ID, quantity, selectedSource);
            alert(`${quantity} of ${product.Name} (Variation: ${selectedSource}) added to cart`);
        } else {
            alert("Please select a variation before adding to cart.");
        }
    }
    
    // Display error message if one occurs
    if (error) {
        return <div>{error}</div>;
    }

    // Display loading message while product data is being fetched
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='master-container'>
            <div className="image-section">
                <img src="/product/ProductPlaceholder.webp" alt="Product Placeholder" className="product-image" />

                <div className="product-descriptions">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div style={{ margin: "0.5rem 5%", fontSize: "1.5rem" }}>Product Description</div>
                        <div style={{ margin: "0.5rem 0", fontSize: "0.75rem" }}>Product SKU: {product.ID}</div>
                    </div>
                    <div style={{ margin: "0.5rem 5%" }}>{product.Description || "No description available"}</div>
                    <div style={{ margin: "0.5rem 5%", fontSize: "0.9rem" }}>Published: {formatDate(product.Published)}</div>
                </div>
            </div>
            <div className="text-section">
                <div className="title">{product.Name || "Unnamed product"}</div>
                <div className="author">{product.Author || "Unknown author"}</div>
                <div className="tags-container">
                    <div className="tag">{genre}</div>
                    <div className="tag">{subGenre}</div>
                    <div className="tag">{product.Author}</div>
                </div>
                <div className="rating">★★★★☆</div>
                <hr className="section-breaker"></hr>
                <div className="price">${product.Price || "N/A"}</div>
                <hr className="section-breaker"></hr>
                <div className="section-title">Variations</div>
                <StylisedRadio 
                    options={options} 
                    defaultSelection={0} 
                    onOptionSelect={(index) => setSelectedVariation(index)} // Capture the selected variation index
                />
                <div className="section-title">Quantity</div>
                <div className="bottom-row">
                    <div className="quantity-container">
                        <div className="quantity-arrow" onClick={subtractQuantity}>❰</div>
                        <div className="counter">{quantity}</div>
                        <div className="quantity-arrow" onClick={addQuantity}>❱</div>
                    </div>
                    <div className="button" onClick={addToCart}>Add to Cart</div>
                </div>
            </div>
        </div>
    );
}

export default ProductDisplay;
