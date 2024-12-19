import Line from "../Line";
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { updateName, updateEmail } from '../../helpers/PostAPI';

const BasicDetails = ({ userProfile, onUpdate }) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Populate the form fields based on the initial user profile data
        if (userProfile) {
            const name = userProfile.Name.split(" ");
            setFirstname(name[0]);
            setLastname(name[1] || "");
            setEmail(userProfile.Email || "");
        }
    }, [userProfile]);

    // Save user profile updates based on field type (name or email)
    const handleSave = async (type) => {
        const sessionData = JSON.parse(localStorage.getItem("sessionData"));

        // Ensure session data is present in localStorage before making updates
        if (!sessionData) {
            console.error("Session data not found.");
            return;
        }

        if (type === "name") {
            try {
                // Update user's name in the database
                await updateName(sessionData.userID, `${firstname} ${lastname}`);

                // Sync updated name with local session data and localStorage
                sessionData.name = `${firstname} ${lastname}`;
                localStorage.setItem("sessionData", JSON.stringify(sessionData));

                // Trigger callback to update profile display and refresh page
                onUpdate(`${firstname} ${lastname}`, email);
                window.location.reload();
            } catch (error) {
                console.error("Error updating name:", error);
            }
        } else if (type === "email") {
            try {
                // Update user's email in the database
                await updateEmail(sessionData.userID, email);

                // Sync updated email with local session data and localStorage
                sessionData.email = email;
                localStorage.setItem("sessionData", JSON.stringify(sessionData));

                // Trigger callback to update profile display and refresh page
                onUpdate(`${firstname} ${lastname}`, email);
                window.location.reload();
            } catch (error) {
                console.error("Error updating email:", error);
            }
        }
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <div>
                <h1>Basic Details</h1>
                <Line />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexGrow: 1 }}>
                        <div style={{ flexDirection: 'column' }}>
                            <div style={{ paddingBottom: "0.5rem" }}>First Name</div>
                            <Box
                                component="input"
                                name="first-name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                sx={{
                                    borderRadius: '4px',
                                    border: '1px solid #D59C36',
                                    padding: '0rem 1rem',
                                    margin: 0,
                                    color: 'white'
                                }}
                            />
                        </div>
                        <div style={{ paddingLeft: "1rem", flexDirection: 'column' }}>
                            <div style={{ paddingBottom: "0.5rem" }}>Last Name</div>
                            <Box
                                component="input"
                                name="last-name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                sx={{
                                    borderRadius: '4px',
                                    border: '1px solid #D59C36',
                                    padding: '0rem 1rem',
                                    margin: 0,
                                    color: 'white'
                                }}
                            />
                        </div>
                    </div>
                    <Button 
                        variant="contained" 
                        onClick={() => handleSave("name")} 
                        sx={{ marginLeft: '1rem', backgroundColor: '#D59C36', color: 'white' }}
                    >
                        Save
                    </Button>
                </div>
            </div>

            <div style={{ paddingTop: "2rem" }}>
                <h1>Contact Information</h1>
                <Line />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ paddingBottom: "0.5rem" }}>Email</div>
                        <Box
                            component="input"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0rem 1rem',
                                margin: 0,
                                color: 'white'
                            }}
                        />
                    </div>
                    <Button 
                        variant="contained" 
                        onClick={() => handleSave("email")} 
                        sx={{ marginLeft: '1rem', backgroundColor: '#D59C36', color: 'white' }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BasicDetails;
