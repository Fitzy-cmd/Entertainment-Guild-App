import FormFill from '../components/FormFill';
import React, { useState } from 'react';
import CustomLink from "../components/CustomLink";
import { useNavigate } from "react-router-dom";
import HandleLogin from "../helpers/HandleLogin";
import {validateEmail} from "../helpers/Validator"

const Signin = () => {
    // State to manage hover states for button styles
    const [isHoveredGold, setIsHoveredGold] = useState(false);
    const [isHoveredBlack, setIsHoveredBlack] = useState(false);
    
    // State to hold form input values
    const [formValues, setFormValues] = useState({});
    
    // State to hold result messages for user feedback
    const [result, setResult] = useState("");
    
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Placeholder text for input fields
    const placeholders = ['Email Address', 'Password'];

    // Handler for form value changes
    const handleFormChange = (newFormData) => {
        setFormValues(newFormData); // Update formValues state with new data
    };

    // Async function to handle user login
    const onLogin = async () => {
        if(validateEmail(formValues["input-0"])){
            const result = await HandleLogin(formValues["input-0"], formValues["input-1"]); // Call login function
        
            // Check for success property in the result
            if (result && result.success) {
                setResult("Authentication successful!"); // Set success message
                navigate(`/profile`); // Navigate to profile page
            } else {
                setResult("Authentication failed!"); // Set failure message
            }
        } else {
            alert("Invalid email. Check your email and try again.")
        }
    };

    // Styles for the sign-in section
    const signinStyle = {
        height: "100vh", // Full viewport height
        width: "60%", // Width of the sign-in section
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    // Styles for the sign-up section
    const signupStyle = {
        height: "100vh", // Full viewport height
        width: "40%", // Width of the sign-up section
        backgroundColor: "#D59C36", // Background color for the sign-up section
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    // Styles for the sign-up redirection text
    const signupRedirText = {
        color: "#141414", // Text color
        textAlign: 'center' // Center text alignment
    };

    // Styles for the gold button
    const buttonGold = {
        transition: "0.3s", // Smooth transition for hover effect
        backgroundColor: isHoveredGold ? "#D59C36" : "#553F16", // Change background color on hover
        padding: "0.75rem 3rem", // Padding for button
        cursor: isHoveredGold ? "pointer" : "default", // Change cursor on hover
    };

    // Styles for the black button
    const buttonBlack = {
        transition: "0.3s", // Smooth transition for hover effect
        backgroundColor: isHoveredBlack ? "#553F16" : "#141414", // Change background color on hover
        padding: "0.75rem 3rem", // Padding for button
        cursor: isHoveredBlack ? "pointer" : "default" // Change cursor on hover
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={signinStyle}>
                <div>
                    <h1>Login to your Account</h1>
                    <FormFill placeholders={placeholders} passwordIndexes={[1]} onFormChange={handleFormChange} />
                </div>
                <div
                    style={buttonGold}
                    onMouseEnter={() => setIsHoveredGold(true)}
                    onMouseLeave={() => setIsHoveredGold(false)}
                    onClick={onLogin}
                >
                    Log in
                </div>
                <CustomLink to={"/employeesignin"} style={{textDecoration: "underline", color: "white", cursor: "pointer"}}>
                    <div>Employee Login Portal</div>
                </CustomLink>
                {result && <div style={{ color: 'red', marginTop: '1rem' }}>{result}</div>}
            </div>
            <div style={signupStyle}>
                <h1 style={signupRedirText}>New Here?</h1>
                <p style={{ padding: "0 auto", color: "#141414", textAlign: 'center' }}>
                    Sign up and discover a world<br />of fun at your fingertips
                </p>
                <CustomLink to={"/signup"} style={{ textDecoration: "none", color: "white" }}>
                    <div
                        style={buttonBlack}
                        onMouseEnter={() => setIsHoveredBlack(true)}
                        onMouseLeave={() => setIsHoveredBlack(false)}
                    >
                        Sign up
                    </div>
                </CustomLink>
            </div>
        </div>
    );
}

export default Signin;
