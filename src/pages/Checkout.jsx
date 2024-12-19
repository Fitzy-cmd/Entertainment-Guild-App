import React, { useState, useContext } from 'react';
import CheckoutForm from "../components/CheckoutForm";
import CartView from "../components/CartView";
import SubtotalView from '../components/SubtotalView';
import { addNewOrder } from '../helpers/PostAPI'
import { CartContext } from '../helpers/CartContext'
import { useNavigate } from "react-router-dom";
import { validateEmail, validateCreditCardNumber, validateCVV, validatePostcode, validateAustralianAddress, validatePhoneNumber } from "../helpers/Validator"

const Checkout = () => {
    const [isFormValid, setIsFormValid] = useState(false); // State to track form validity
    const [formData, setFormData] = useState({}); // State to store form data
    const { cart, clearCart } = useContext(CartContext)
    const navigate = useNavigate();

    const buttonStyle = {
        transition: '0.3s',
        padding: '0.75rem 5rem',
        marginTop: '1rem',
        width: 'fit-content',
        color: isFormValid ? 'white' : '#B0B0B0', // Change text color when disabled
        cursor: isFormValid ? 'pointer' : 'not-allowed', // Change cursor style
        border: 'none',
        zoom: "2",
        fontWeight: 'bold',
        fontSize: '1.1rem',
        backgroundColor: isFormValid ? '#553F16' : '#3C3C3C', // Change background color when disabled
    };

    const handleMouseOver = (e) => {
        if (isFormValid) {
            e.target.style.backgroundColor = '#D59C36'; // Highlight only if valid
        }
    };

    const handleMouseOut = (e) => {
        if (isFormValid) {
            e.target.style.backgroundColor = '#553F16'; // Reset only if valid
        }
    };

    // Callback to handle form validation state
    const handleFormValidation = (isValid) => {
        setIsFormValid(isValid);
    };

    // Callback to handle form data changes
    const handleFormChange = (data) => {
        setFormData(data);
    };


    const handleCompleteOrder = async() => {
        if (isFormValid) {
            // validate import inputs
            const errors = {}

            if (!validateEmail(formData.email)) { errors.email = "- Invalid email" }
            if (!validateCreditCardNumber(formData.cardNumber)) { errors.cardNumber = "- Invalid card number" }
            if (!validateCVV(formData.cvv)) { errors.cvv = "- Invalid CVV" }
            if (!validatePostcode(formData.postcode)) { errors.postcode = "- Invalid postcode" }
            if (!validatePostcode(formData.billingPostcode)) { errors.billingPostcode = "- Invalid billing postcode" }
            if (!validateAustralianAddress(formData.address)) { errors.address = "- Invalid address" }
            if (!validatePhoneNumber(formData.phone)) { errors.phone = "- Invalid phone number" }

            // all validations passed
            if (Object.keys(errors).length === 0) {
                const success = await addNewOrder(formData, cart)
                if (success === true) {
                    alert("New order created! Check your inbox for confirmation email!")
                    clearCart()
                    navigate("/")
                }
            } else {
                const errorMessages = Object.values(errors).join('\n');
                alert('Invalid details! Check the form for the following:\n' + errorMessages);
            }
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Passing both validation and form data callback to CheckoutForm */}
            <CheckoutForm validateForm={handleFormValidation} onFormChange={handleFormChange} />
            <div style={{ zoom: "0.7", padding: '2rem' }}>
                <CartView />
                <SubtotalView onCheckout={true} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        style={buttonStyle}
                        onClick={handleCompleteOrder}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        disabled={!isFormValid} // Disable button based on form validity
                    >
                        Complete Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
