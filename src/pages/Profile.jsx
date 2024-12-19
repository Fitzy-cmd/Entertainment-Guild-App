import { FaRegUserCircle, FaRegClock, FaCog, FaDoorOpen } from "react-icons/fa";
import { useState, useEffect } from 'react';
import StylisedRadio from "../components/StylisedRadio";
import { useNavigate } from "react-router-dom";
import BasicDetails from "../components/Profile Components/BasicDetails";
import Settings from "../components/Profile Components/Settings";
import OrderHistory from "../components/Profile Components/OrderHistory";
import axios from 'axios';
import { logout } from '../helpers/HandleLogin';

export default function Profile() {
    // State to hold user profile information
    const [userProfile, setUserProfile] = useState(null);
    
    // State to track the currently active option in the profile
    const [activeOption, setActiveOption] = useState(0);
    
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Effect to check session data and fetch user profile
    useEffect(() => {
        // Retrieve session data from local storage
        const sessionData = JSON.parse(localStorage.getItem("sessionData"));

        // Check if session data exists and if userID is available
        if (!sessionData || !sessionData.userID) {
            navigate("/signin"); // Redirect to sign-in if no session
        } else {
            // Function to fetch user profile data
            const fetchUserProfile = async () => {
                try {
                    const token = ''; // Hardcoded token (consider using secure storage)
                    const response = await axios.get(`Patrons/${sessionData.userID}`, {
                        headers: { 'xc-token': token } // Set token in request headers
                    });
                    setUserProfile(response.data); // Set user profile with fetched data
                } catch (error) {
                    console.error("Error fetching user profile:", error); // Log any errors
                    navigate("/signin"); // Redirect to sign-in on error
                }
            };

            fetchUserProfile(); // Call the function to fetch user profile
        }
    }, [navigate]); // Dependency array for useEffect

    // Function to update user profile with new values
    const updateUserProfile = (updatedName, updatedEmail) => {
        setUserProfile(prevProfile => ({
            ...prevProfile, // Retain previous profile data
            Name: updatedName, // Update Name
            Email: updatedEmail // Update Email
        }));
    };

    // Handler function for user logout
    const handleLogout = () => {
        logout(navigate); // Call logout function and navigate
    }

    // Style object for the account sidebar
    const accountStyle = {
        height: "100vh", // Full height of the viewport
        width: "25%", // Width for the sidebar
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#D59C36' // Sidebar background color
    };

    // Style object for navigation text
    const navigationStyle = {
        color: '#141414', // Navigation text color
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontSize: '2.5rem', // Font size for navigation
        padding: '0.75rem', // Padding for aesthetics
        margin: "0 auto" // Center align navigation
    };

    // Style object for buttons
    const buttonStyle = {
        backgroundColor: "#141414", // Default button background color
        transition: "0.3s", // Smooth transition for hover effect
        padding: "0.5rem 2rem", // Padding for button
        marginTop: "1rem", // Space above the button
        marginRight: "1rem", // Space to the right of the button
        '&:hover': {
            backgroundColor: "#D59C36", // Change background color on hover
            cursor: 'pointer' // Change cursor to pointer on hover
        }
    };

    // Function to render content based on the active option
    const renderContent = () => {
        switch (activeOption) {
            case 0:
                return <BasicDetails userProfile={userProfile} onUpdate={updateUserProfile} />; // Render BasicDetails component
            case 1:
                return <OrderHistory userID={userProfile.UserID} />; // Render OrderHistory component
            case 2:
                return <Settings />; // Render Settings component
            default:
                return null; // Fallback case if no options match
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={accountStyle}>
                <h1 style={navigationStyle}>My Account</h1>
                <div style={navigationStyle}>
                    <FaRegUserCircle size={115} style={{ color: "#141414" }} />
                </div>
                {userProfile && (
                    <>
                        <div style={{ color: "#141414", paddingTop: "0.75rem", fontSize: "1.5rem" }}>
                            {userProfile.Name}
                        </div>
                        <div style={{ color: "#141414", fontSize: "1rem" }}>
                            User ID: {userProfile.UserID}
                        </div>
                    </>
                )}
                <div>
                    <StylisedRadio
                        options={['My Details', 'Order History', 'Settings', 'Logout']}
                        iconNames={["FaRegUserCircle", "FaRegClock", "FaCog", "FaDoorOpen"]}
                        columnStyle={true}
                        inactiveColour="#141414"
                        activeColour="#553F16"
                        onOptionSelect={(index) => {
                            if (index === 3) {
                                handleLogout(); // Handle logout
                            } else {
                                setActiveOption(index); // Set active option for details, history, and settings
                            }
                        }}
                    />
                </div>
            </div>
            <div style={{ width: "100%" }}>
                {renderContent()}
            </div>
        </div>
    );
}
