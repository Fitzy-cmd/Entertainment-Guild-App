import FormFill from '../components/FormFill';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomLink from "../components/CustomLink";
import {addNewUser} from '../helpers/PostAPI'
import {sha256, generateSalt} from "../helpers/HandleLogin"
import {validateEmail} from "../helpers/Validator"

export default function Signup() {
    // State to manage hover states for button styles
    const [isHoveredGold, setIsHoveredGold] = useState(false);
    const [isHoveredBlack, setIsHoveredBlack] = useState(false);

    // Placeholders for input fields
    const placeholders = ['Name', 'Email Address', 'Password'];

    // State to hold form input values
    const [formValues, setFormValues] = useState({});
    
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Handler for form value changes
    const handleFormChange = (newFormData) => {
        setFormValues(newFormData); // Update formValues state with new data
    };

    // Styles for the master container
    const masterStyle = {
        display: "flex"
    };

    // Styles for the sign-in section
    const signinStyle = {
        height: "100vh", // Full viewport height
        width: "40%", // Width of the sign-in section
        backgroundColor: "#D59C36", // Background color for sign-in
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    // Styles for the sign-up section
    const signupStyle = {
        height: "100vh", // Full viewport height
        width: "60%", // Width of the sign-up section
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    // Styles for the sign-up redirect text
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

    // Async function to handle user sign-up
    const onSignup = async () => {
        if(validateEmail(formValues["input-1"])) {
            const salt = generateSalt(); // Generate a unique salt for password hashing
            const hash = await sha256(salt + formValues["input-2"]); // Hash the password with the salt
            const userObject = {
                Name: formValues["input-0"], // Get the user's name from form values
                Email: formValues["input-1"], // Get the user's email from form values
                Salt: salt, // Store the generated salt
                HashPW: hash // Store the hashed password
            };
    
            // Add the new user and check if successful
            const successful = await addNewUser(userObject);
            if (successful) {
                navigate("/signin"); // Redirect to sign-in page on success
            } else {
                // Handle failure case (you might want to show an error message)
                console.error("Signup failed");
            }
        } else {
            alert("Invalid email. Check your email and try again.")
        }
    };

    return (
        <div style={masterStyle}>
            <div style={signinStyle}>
                <h1 style={signupRedirText}>Welcome Back!</h1>
                <p style={{ padding: "0 auto", color: "#141414", textAlign: 'center' }}>
                    To keep up to date with your<br />your orders and explore new fun!
                </p>
                <CustomLink to={"/signin"} style={{ textDecoration: "none", color: "white" }}>
                    <div
                        style={buttonBlack}
                        onMouseEnter={() => setIsHoveredBlack(true)}
                        onMouseLeave={() => setIsHoveredBlack(false)}
                    >
                        Log in
                    </div></CustomLink>
            </div>
            <div style={signupStyle}>
                <div>
                    <h1>Sign up to have fun!</h1>
                    <FormFill placeholders={placeholders} passwordIndexes={[2]} onFormChange={handleFormChange}/>
                </div>
                <div
                    style={buttonGold}
                    onMouseEnter={() => setIsHoveredGold(true)}
                    onMouseLeave={() => setIsHoveredGold(false)}
                    onClick={onSignup}
                >
                    Sign Up
                </div>
            </div>
        </div>
    );
}