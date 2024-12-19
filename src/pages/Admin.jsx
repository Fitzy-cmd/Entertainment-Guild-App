import { FaTools } from "react-icons/fa";
import { useState, useEffect } from 'react';
import StylisedRadio from "../components/StylisedRadio";
import { useNavigate } from "react-router-dom";
import ItemManagement from '../components/AdminComponents/ItemManagement';
import UserManagement from '../components/AdminComponents/UserManagement';
import AdminManagement from '../components/AdminComponents/AdminManagement';
import AdminSettings from '../components/AdminComponents/AdminSettings';
import { logout } from '../helpers/HandleLogin';

export default function Admin({ setAdmin }) {
    // State to manage user profile information
    const [userProfile, setUserProfile] = useState({
        Name: "",
        Email: "",
        username: ""
    });

    // State to track the currently active navigation option
    const [activeOption, setActiveOption] = useState(0);

    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Effect to handle session management and user profile setup
    useEffect(() => {
        const sessionData = JSON.parse(localStorage.getItem("sessionData")); // Retrieve session data from local storage
        if (sessionData === null) {
            setAdmin(false); // If no session data, set admin status to false
            navigate("/"); // Navigate to home page
        } else {
            // Set user profile with data from session
            setUserProfile({
                Name: sessionData.name,
                Email: sessionData.email,
                username: sessionData.username
            });
        }
    }, [navigate, setAdmin]); // Dependency array for useEffect

    // Handler function to log out the user
    const handleLogout = () => {
        setAdmin(false); // Set admin status to false
        logout(navigate); // Call logout function and navigate
    };

    // Style object for the sidebar account management section
    const accountStyle = {
        height: "100vh", // Set sidebar height to full viewport height
        width: "25%", // Set sidebar width
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#D59C36', // Sidebar background color
        position: 'fixed', // Fix sidebar position to the left
        top: 0,
        left: 0,
        bottom: 0 // Ensure it stretches to the bottom
    };

    // Style object for the main content area
    const mainContentStyle = {
        marginLeft: "25%", // Ensure main content respects sidebar width
        width: "75%", // Set main content width
        padding: '20px', // Add padding for aesthetics
    };

    // Style object for the navigation text
    const navigationStyle = {
        color: '#141414', // Navigation text color
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontSize: '2.5rem', // Font size for navigation
        padding: '0.75rem', // Padding for navigation
        margin: "0 auto" // Center align navigation
    };

    // Function to render content based on the active navigation option
    const renderContent = () => {
        // Render different components based on the active option
        switch (activeOption) {
            case 0:
                return <ItemManagement adminKey={userProfile.username} />; // Render ItemManagement
            case 1:
                return <UserManagement adminKey={userProfile.username} />; // Render UserManagement
            case 2:
                return <AdminManagement adminKey={userProfile.username} />; // Render AdminManagement
            case 3:
                return <AdminSettings adminKey={userProfile.username} />; // Render AdminSettings
            default:
                return null; // Fallback case
        }
    };

    const handleOptionSelect = (index) => {
        if (index === 4) { // Index 3 is for 'Logout'
            handleLogout();
        } else {
            setActiveOption(index);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}> {/* Ensure full height */}
            <div style={accountStyle}>
                <h1 style={navigationStyle}>Admin Panel</h1>
                <div style={navigationStyle}>
                    <FaTools size={115} style={{ color: "#141414" }} />
                </div>
                {userProfile && (
                    <>
                        <div style={{ color: "#141414", paddingTop: "0.75rem", fontSize: "1.5rem" }}>
                            {userProfile.Name}
                        </div>
                        <div style={{ color: "#141414", fontSize: "1rem" }}>
                            Username: {userProfile.username}
                        </div>
                    </>
                )}
                <div>
                    <StylisedRadio
                        options={['Manage Items', 'Manage Users', 'Manage Admins', 'Settings', 'Logout']}
                        iconNames={["FaClipboardList", "FaUserShield", "FaUserCog", "FaCog", "FaDoorOpen"]}
                        columnStyle={true}
                        inactiveColour="#141414"
                        activeColour="#553F16"
                        onOptionSelect={handleOptionSelect} // Pass a single function
                    />
                </div>
            </div>
            <div style={mainContentStyle}>
                {renderContent()}
            </div>
        </div>
    );
}
