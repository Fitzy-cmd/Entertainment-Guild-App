import Line from "./Line";
import { useContext, useEffect, useState } from 'react';
import { getProductDetails } from '../helpers/GetAPI';
import { CartContext } from '../helpers/CartContext';
import CustomLink from './CustomLink';  // Import Link for navigation

const SubtotalView = ({ onCheckout = false }) => {  // Make onCheckout a prop
    const { cart } = useContext(CartContext);
    const [cartDetails, setCartDetails] = useState([]);
    const [subtotal, setSubtotal] = useState(0); // Subtotal which includes product prices with the surcharge

    useEffect(() => {
        async function fetchCartDetails() {
            const details = await Promise.all(
                cart.map(async item => {
                    const product = await getProductDetails(item.productID);
                    return { price: parseFloat(product[0].Price), quantity: item.quantity }; // Price already includes surcharge
                })
            );
            setCartDetails(details);

            // Calculate the subtotal directly from the product prices (which include surcharge)
            const total = details.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setSubtotal(total.toFixed(2)); // Set subtotal, rounding to 2 decimal places
        }

        if (cart.length > 0) {
            fetchCartDetails();
        }
    }, [cart]);

    const breakdownLineStyle = {
        display: 'flex',
        justifyContent: "space-between"
    };

    const buttonStyle = {
        display: 'block',
        width: '100%',
        padding: '1rem',
        backgroundColor: '#553F16',
        color: 'white',
        textAlign: 'center',
        marginTop: '1rem',
        textDecoration: 'none',
        fontSize: '1.25rem',
        transition: 'background-color 0.3s ease',
        cursor: cart.length === 0 ? 'not-allowed' : 'pointer', // Change cursor style if disabled
    };

    const buttonHoverStyle = {
        backgroundColor: '#D59C36',
        cursor: 'pointer',
    };

    // Only return cost breakdown if onCheckout is true
    if (onCheckout) {
        return (
            <div className="cost-breakdown" style={{ padding: "0"}}>
                <div style={{ margin: '0 auto' }}>
                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '1.3rem' }}>PRODUCT TOTAL</div>
                        <div style={{ fontSize: '1.3rem' }}>${((subtotal / 110) * 100).toFixed(2)}</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>SURCHARGE</div>
                        <div style={{ fontSize: '0.9rem' }}>${((subtotal / 110) * 10).toFixed(2)}</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>PROMO CODE</div>
                        <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>SHIPPING</div>
                        <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                    </div>
                    <Line />
                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '2rem' }}>GRAND TOTAL</div>
                        <div style={{ fontSize: '2rem' }}>${subtotal}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Otherwise, return the full summary including checkout button
    return (
        <div style={{
            border: "0.1rem solid #D59C36",
            width: "25rem",
            boxSizing: "border-box",
            marginTop: '5rem',
            marginRight: '2rem',
            height: '100%'
        }}>
            <h2 style={{ paddingLeft: '1rem' }}>Summary</h2>
            <div className="cost-breakdown" style={{ padding: "1rem" }}>
                <div style={{ margin: '0 auto' }}>
                    <Line />
                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '1.3rem' }}>PRODUCT TOTAL</div>
                        <div style={{ fontSize: '1.3rem' }}>${((subtotal / 110) * 100).toFixed(2)}</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>SURCHARGE</div>
                        <div style={{ fontSize: '0.9rem' }}>${((subtotal / 110) * 10).toFixed(2)}</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>PROMO CODE</div>
                        <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                    </div>

                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '0.9rem' }}>SHIPPING</div>
                        <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                    </div>
                    <Line />
                    <div style={breakdownLineStyle}>
                        <div style={{ fontSize: '1.5rem' }}>SUBTOTAL</div>
                        <div style={{ fontSize: '1.5rem' }}>${subtotal}</div>
                    </div>

                    {/* Checkout Button */}
                    <CustomLink
                        to="/checkout"
                        style={buttonStyle}
                        onMouseOver={(e) => { if (cart.length > 0) e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; }}
                        onMouseOut={(e) => { if (cart.length > 0) e.target.style.backgroundColor = buttonStyle.backgroundColor; }}
                        onClick={(e) => { if (cart.length === 0) e.preventDefault(); }} // Prevent navigation if cart is empty
                    >
                        {cart.length === 0 ? 'Checkout Disabled' : 'Checkout'}
                    </CustomLink>
                </div>
            </div>
        </div>
    );
};

export default SubtotalView;
