import FormFill from '../components/FormFill';
import React, { useState } from 'react';
import CustomLink from "../components/CustomLink";
import { useNavigate } from "react-router-dom";
import { employeeLogin } from "../helpers/HandleLogin";
import { validateEmail } from "../helpers/Validator"

const EmployeeSignin = ({ onLoginSuccess }) => {
    const [isHoveredGold, setIsHoveredGold] = useState(false);
    const [isHoveredBlack, setIsHoveredBlack] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [result, setResult] = useState("");
    const navigate = useNavigate();

    const placeholders = ['Email Address', 'Password'];

    const handleFormChange = (newFormData) => {
        setFormValues(newFormData);
    };

    const onLogin = async () => {
        if (validateEmail(formValues["input-0"])) {
            const result = await employeeLogin(formValues["input-0"], formValues["input-1"]);

            if (result && result.success) { // Check for success property
                setResult("Authentication successful!");

                // Navigate to appropriate page based on admin status
                if (result.isAdmin) {
                    onLoginSuccess(result.isAdmin)
                    navigate('/admin')
                } else {
                    navigate(`/employee`); // Redirect to profile if normal employee
                }
            } else {
                setResult("Authentication failed!");
            }
        } else {
            alert("Invalid email. Check your email and try again.")
        }
    };

    const forgotPassword = () => {
        alert("Contact an administrator for a password reset");
    };

    const signinStyle = {
        height: "100vh",
        width: "60%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    const signupStyle = {
        height: "100vh",
        width: "40%",
        backgroundColor: "#D59C36",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column' // Stack child elements vertically
    };

    const signupRedirText = {
        color: "#141414",
        textAlign: 'center'
    };

    const buttonGold = {
        transition: "0.3s",
        backgroundColor: isHoveredGold ? "#D59C36" : "#553F16",
        padding: "0.75rem 3rem",
        cursor: isHoveredGold ? "pointer" : "default",
    };

    const buttonBlack = {
        transition: "0.3s",
        backgroundColor: isHoveredBlack ? "#553F16" : "#141414",
        padding: "0.75rem 3rem",
        cursor: isHoveredBlack ? "pointer" : "default"
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={signinStyle}>
                <div>
                    <h1>Employee Login</h1>
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
                <div onClick={forgotPassword} style={{ padding: "1rem", textDecoration: "underline", cursor: "pointer" }}>Forgot Password?</div>
                {result && <div style={{ color: 'red', marginTop: '1rem' }}>{result}</div>}
            </div>
            <div style={signupStyle}>
                <h1 style={signupRedirText}>Not an employee?</h1>
                <p style={{ padding: "0 auto", color: "#141414", textAlign: 'center' }}>
                    Return to the customer <br /> signin portal!
                </p>
                <CustomLink to={"/signin"} style={{ textDecoration: "none", color: "white" }}>
                    <div
                        style={buttonBlack}
                        onMouseEnter={() => setIsHoveredBlack(true)}
                        onMouseLeave={() => setIsHoveredBlack(false)}
                    >
                        Customer Signin
                    </div>
                </CustomLink>
            </div>
        </div>
    );
}

export default EmployeeSignin;
