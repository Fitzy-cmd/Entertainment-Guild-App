import { FaUserTie, FaRegClock, FaCog, FaDoorOpen, FaClipboardList, FaUserShield } from "react-icons/fa"; // Added new icons
import { useState, useEffect } from 'react';
import StylisedRadio from "../components/StylisedRadio";
import { useNavigate } from "react-router-dom";
import ItemView from "../components/EmployeeComponents/ItemView";
import UserView from "../components/EmployeeComponents/UserView";
import axios from 'axios';
import { logout } from '../helpers/HandleLogin';

const EmployeeProfile = () => {
    // State to hold user profile information
    const [userProfile, setUserProfile] = useState(null);
    
    // State to track the currently active option in the profile
    const [activeOption, setActiveOption] = useState(0);
    
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Effect to handle user session and profile fetching
    useEffect(() => {
        // Retrieve session data from local storage
        const sessionData = JSON.parse(localStorage.getItem("sessionData"));

        // Check if session data exists and if username is available
        if (!sessionData || !sessionData.username) {
            navigate("/employeesignin"); // Redirect to sign-in if no session
        } else {
            // Function to fetch user profile data
            const fetchUserProfile = async () => {
                try {
                    const token = ''; // Hardcoded token (consider secure storage)
                    const response = await axios.get(`User/${sessionData.username}`, {
                        headers: { 'xc-token': token } // Set token in headers
                    });
                    setUserProfile(response.data); // Set user profile with fetched data
                } catch (error) {
                    console.error("Error fetching user profile:", error); // Log error
                    navigate("/employeesignin"); // Redirect to sign-in on error
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
    };

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

    // Function to render content based on the active option
    const renderContent = () => {
        switch (activeOption) {
            case 0:
                return <ItemView />; // Render ItemView for option 0
            case 1:
                return <UserView />; // Render UserView for option 1
            default:
                return null; // Fallback case if no options match
        }
    };

    // Handle option selection
    const handleOptionSelect = (selectedIndex) => {
        if (selectedIndex === 2) {
            handleLogout(); // Trigger logout if "Logout" is selected
        } else {
            setActiveOption(selectedIndex); // Update active option otherwise
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={accountStyle}>
                <h1 style={navigationStyle}>Employee</h1>
                <div style={navigationStyle}>
                    <FaUserTie size={115} style={{ color: "#141414" }} />
                </div>
                {userProfile && (
                    <>
                        <div style={{ color: "#141414", paddingTop: "0.75rem", fontSize: "1.5rem" }}>
                            {userProfile.Name}
                        </div>
                        <div style={{ color: "#141414", fontSize: "1rem" }}>
                            User ID: {userProfile.UserName}
                        </div>
                    </>
                )}
                <div>
                    <StylisedRadio
                        options={['View Items', 'View Accounts', 'Logout']}
                        iconNames={["FaClipboardList", "FaUserShield", "FaDoorOpen"]}
                        columnStyle={true}
                        inactiveColour="#141414"
                        activeColour="#553F16"
                        onOptionSelect={handleOptionSelect} // Pass single handler function
                    />
                </div>
            </div>
            <div style={{ width: "100%" }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default EmployeeProfile;
