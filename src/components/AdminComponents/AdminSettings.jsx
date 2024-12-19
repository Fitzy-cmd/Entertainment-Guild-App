import Line from "../Line";
import { useState } from 'react';
import { validateEmployeePassword, logout } from '../../helpers/HandleLogin';
import { deleteUser, updateUserPassword } from '../../helpers/PostAPI'
import { useNavigate } from "react-router-dom";


const Settings = ({ adminKey }) => {
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [warning, setWarning] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        const isValidPassword = await validateEmployeePassword(adminKey, password); // Use await here

        if (isValidPassword) {
            // Call functions to delete account and log out
            alert("Your admin account has been successfully deleted!")
            //deleteUser(userID);
            //logout(navigate);

            //setWarning('Your account has been deleted.');
        } else {
            alert("Invalid Password")
        }
    }

    async function handlePasswordChange() {
        const matchingPassword = await validateEmployeePassword(adminKey, oldPassword)
        if (matchingPassword) {
            updateUserPassword(adminKey, newPassword)
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
                <button onClick={handlePasswordChange} style={{ marginLeft: '1rem' }}>Change Password</button>
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
