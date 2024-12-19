import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../helpers/CartContext';
import { getProductDetails } from '../helpers/GetAPI';
import Line from '../components/Line';

const CartView = () => {
    const { cart, clearCart, removeFromCart } = useContext(CartContext);
    const [cartDetails, setCartDetails] = useState([]);

    // Fetches detailed product information for items in the cart
    useEffect(() => {
        async function fetchCartDetails() {
            const details = await Promise.all(
                cart.map(async (item) => {
                    const product = await getProductDetails(item.productID);
                    return { product: product[0], quantity: item.quantity, source: item.source };
                })
            );
            setCartDetails(details);
        }

        // Trigger fetch if the cart is not empty
        if (cart.length > 0) {
            fetchCartDetails();
        }
    }, [cart]);

    // Renders empty cart message if there are no items in cart
    if (cartDetails.length === 0) {
        return (
            <div style={{ minWidth: "42rem" }}>
                <Line style={{ margin: '0.25rem 0' }} />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr 1fr',
                        marginBottom: '0.25rem',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: '1.3rem' }}>Product</div>
                    <div style={{ fontSize: '1.3rem', textAlign: 'center', paddingLeft: '2rem' }}>Price</div>
                    <div style={{ fontSize: '1.3rem', textAlign: 'right' }}>Total</div>
                </div>
                <Line style={{ margin: '0.25rem 0' }} />
                <div style={{ maxHeight: '65vh', overflowY: 'auto' }}></div>
                <div>Your cart is empty</div>
            </div>
        );
    }

    const buttonStyle = {
        transition: '0.3s',
        backgroundColor: '#553F16',
        padding: '0.75rem 3.25rem',
        marginTop: '0.6rem',
        width: 'fit-content',
        color: 'white',
        cursor: 'pointer',
        border: 'none',
    };

    // Handles mouse hover to change button background color
    const handleMouseOver = (e) => {
        e.target.style.backgroundColor = '#D59C36';
    };

    const handleMouseOut = (e) => {
        e.target.style.backgroundColor = '#553F16';
    };

    return (
        <div>
            <Line style={{ margin: '0.25rem 0' }} />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr',
                    marginBottom: '0.25rem',
                    alignItems: 'center',
                }}
            >
                <div style={{ fontSize: '1.3rem' }}>Product</div>
                <div style={{ fontSize: '1.3rem', textAlign: 'center', paddingLeft: '2rem' }}>Price</div>
                <div style={{ fontSize: '1.3rem', textAlign: 'right' }}>Total</div>
            </div>
            <Line style={{ margin: '0.25rem 0' }} />
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {cartDetails.map((item, index) => (
                    <div key={index}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '3fr 1fr 1fr',
                                alignItems: 'start',
                                marginBottom: '0.25rem',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }}>
                                <img
                                    src="/product/ProductPlaceholder.webp"
                                    alt="Product Placeholder"
                                    width={150}
                                    height={150}
                                />
                                <div style={{ paddingLeft: '0.5rem', maxWidth: '400px', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div
                                            style={{
                                                fontSize: '1.15rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {item.product.Name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>SKU: {item.product.ID}</div>
                                        <div style={{ fontSize: '0.9rem' }}>{item.source}</div>
                                        <div style={{ fontSize: '0.9rem' }}>Quantity: {item.quantity}</div>
                                        <button
                                            style={buttonStyle}
                                            onClick={() => removeFromCart(item.product.ID, item.source)}
                                            onMouseOver={handleMouseOver}
                                            onMouseOut={handleMouseOut}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', paddingLeft: '2rem', fontSize: '1.15rem' }}>
                                ${item.product.Price}
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '1.15rem' }}>
                                ${item.product.Price * item.quantity}
                            </div>
                        </div>
                        <Line style={{ margin: '0.25rem 0' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartView;
