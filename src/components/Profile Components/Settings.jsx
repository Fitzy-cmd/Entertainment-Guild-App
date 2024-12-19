import Line from "../Line";
import { useState } from 'react';
import { validatePassword, logout } from '../../helpers/HandleLogin';
import { deleteUser, updatePatronPassword} from '../../helpers/PostAPI'
import { useNavigate } from "react-router-dom";


const Settings = () => {
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [warning, setWarning] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        const sessionDataString = localStorage.getItem('sessionData');
        const userID = sessionDataString ? JSON.parse(sessionDataString).userID : null;

        if (userID) {
            const isValidPassword = await validatePassword(userID, password); // Use await here

            if (isValidPassword) {

                // Call functions to delete account and log out
                alert("Your account has been successfully deleted!")
                deleteUser(userID);
                logout(navigate);

                setWarning('Your account has been deleted.');
            } else {
                alert("Invalid Password")
            }
        } else {
            setWarning("User not found. Please log in again.");
        }
    };

    async function handlePasswordChange() {
        const sessionDataString = localStorage.getItem('sessionData');
        const userID = sessionDataString ? JSON.parse(sessionDataString).userID : null;
        const matchingPassword = await validatePassword(userID, oldPassword)
        if(matchingPassword) {
            updatePatronPassword(userID, newPassword)
            alert('Password updated!')
        }
    }

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <div>
                <h1>Update Password</h1>
                <Line />
                {warning && <p style={{ color: 'red' }}>{warning}</p>}
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{
                            borderRadius: '4px',
                            border: '1px solid #D59C36',
                            padding: '0rem 0rem',
                            marginRight: "1rem",
                            color: 'white',
                            maxWidth: '20rem'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                            borderRadius: '4px',
                            border: '1px solid #D59C36',
                            padding: '0rem 0rem',
                            margin: 0,
                            color: 'white',
                            maxWidth: '20rem'
                        }}
                    />
                <button onClick={handlePasswordChange} style={{marginLeft: '1rem'}}>Change Password</button>
            </div>
            <div>
                <h1>Delete Account</h1>
                <Line />
                {warning && <p style={{ color: 'red' }}>{warning}</p>}
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        borderRadius: '4px',
                        border: '1px solid #D59C36',
                        padding: '0rem 0rem',
                        margin: 0,
                        color: 'white',
                        maxWidth: '20rem'
                    }}
                />
                <button onClick={handleDelete}>Delete Account</button>
            </div>
        </div>
    );
};

export default Settings;
