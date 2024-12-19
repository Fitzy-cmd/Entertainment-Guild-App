import React, { useState, useEffect } from 'react';
import { updateUser, addNewUser, deleteUser, updatePatronPassword } from '../../helpers/PostAPI';
import { getUsers as fetchUsers } from '../../helpers/GetAPI';
import { sha256, checkPassword } from '../../helpers/HandleLogin'; // Import the sha256 function
import Line from "../Line";

const UserManagement = ({ adminKey }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formDisabled, setFormDisabled] = useState(true);

    // State for the user being edited
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserName, setEditUserName] = useState('');
    const [editUserID, setEditUserID] = useState(null); // New state for User ID

    // State for the new user
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [userSalt, setUserSalt] = useState('');
    const [userPassword, setUserPassword] = useState('');

    useEffect(() => {
        loadUsers();
        const newSalt = generateRandomHash(); // Generate new salt
        setUserSalt(newSalt);
    }, [adminKey]);

    const loadUsers = async () => {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setFormDisabled(false);
        setEditUserEmail(user.Email);
        setEditUserName(user.Name);
        setEditUserID(user.UserID); // Set User ID for the edit section
        resetNewUserFields();
    };

    const handleSaveUser = async (isUpdate) => {
        if (!userSalt) {
            alert("Salt cannot be empty."); // Alert if salt is empty
            return;
        }

        const dataToSave = {
            UserID: selectedUser ? selectedUser.UserID : null,
            Email: isUpdate ? editUserEmail : newUserEmail,
            Name: isUpdate ? editUserName : newUserName,
            Salt: userSalt,
            HashPW: isUpdate ? selectedUser.HashPW : await sha256(userSalt+userPassword), // Hash password for new user
        };

        if (isUpdate) {
            await updateUser(dataToSave);
        } else {
            await addNewUser(dataToSave);
            resetNewUserFields(); // Reset new user fields after adding
            const newSalt = generateRandomHash(); // Generate new salt
            setUserSalt(newSalt);
        }

        resetForm();
        await loadUsers(); // Refresh user list
    };

    const handleDeleteUser = async (user) => {
        await deleteUser(user.UserID);
        
        // Delay the loadUsers call to ensure state has updated
        setTimeout(() => {
            loadUsers(); // Refresh the user list
        }, 100); // Adjust the timeout as necessary
    };

    const handleGenerateSalt = () => {
        const newSalt = generateRandomHash();
        setUserSalt(newSalt);
    };

    // New function to handle password reset
    const handleResetPassword = async () => {
        const newPassword = 'password'; // Default password
        alert(`User's password has been reset to '${newPassword}'`);
        await updatePatronPassword(selectedUser.UserID, newPassword);
    };

    const generateRandomHash = () => {
        return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    };

    const resetForm = () => {
        setSelectedUser(null);
        setFormDisabled(true);
        resetEditUserFields();
        resetNewUserFields();
    };

    const resetEditUserFields = () => {
        setEditUserEmail('');
        setEditUserName('');
        setEditUserID(null);
    };

    const resetNewUserFields = () => {
        setNewUserEmail('');
        setNewUserName('');
        setUserSalt(generateRandomHash()); // Generate new salt on reset
        setUserPassword('');
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <h1>User Management</h1>
            <Line />
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr",
                gap: "1rem",
                alignItems: "center",
                maxHeight: "600px",
                overflowY: "auto",
            }}>
                <h4>User ID</h4>
                <h4>Email</h4>
                <h4>Name</h4>
                <h4>Actions</h4>

                {users.map(user => (
                    <React.Fragment key={user.UserID}>
                        <div>{user.UserID}</div>
                        <div>{user.Email}</div>
                        <div>{user.Name || 'N/A'}</div>
                        <div>
                            <button onClick={() => handleViewDetails(user)}>View/Edit</button>
                            <button onClick={() => handleDeleteUser(user)}>Delete</button>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <h1>View and Edit a User</h1>
            <Line />

            <form>
                <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '3rem' }}>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>User ID</label>
                        <input
                            type="text"
                            value={editUserID !== null ? editUserID : ''}
                            readOnly
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Email</label>
                        <input
                            type="email"
                            disabled={formDisabled}
                            value={editUserEmail}
                            onChange={(e) => setEditUserEmail(e.target.value)}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Name</label>
                        <input
                            type="text"
                            disabled={formDisabled}
                            value={editUserName}
                            onChange={(e) => setEditUserName(e.target.value)}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                </div>
            </form>
            <button onClick={() => handleSaveUser(true)} disabled={formDisabled}>Save to Existing User</button>
            <button onClick={handleResetPassword} disabled={formDisabled} style={{ marginLeft: '1rem' }}>Reset Password</button> {/* New Reset Password button */}

            <h1>Add User</h1>
            <Line />
            <form>
                <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '3rem' }}>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Name</label>
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <div style={{ display: 'flex' }}>
                            <label style={{ fontSize: '1.5rem' }}>Salt</label>
                            <button type="button" onClick={handleGenerateSalt} style={{ marginLeft: '1rem', padding: "0rem 1rem" }}>Generate</button>
                        </div>
                        <input
                            type="text"
                            value={userSalt}
                            readOnly
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Password</label>
                        <input
                            type="text"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #D59C36',
                                padding: '0.25rem 0.5rem',
                                margin: 0,
                                color: 'white',
                                height: '30px'
                            }}
                        />
                    </div>
                </div>
            </form>

            <div style={{ display: 'flex' }}>
                <button onClick={() => handleSaveUser(false)} style={{ marginRight: '1rem' }}>Add New User</button>
            </div>
        </div>
    );
};

export default UserManagement;
