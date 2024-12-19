import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../helpers/GetAPI';
import { updateUserAdminStatus, updateUserPassword } from '../../helpers/PostAPI';
import Line from "../Line";

const AdminManagement = ({ adminKey }) => {
    const [users, setUsers] = useState([]);
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));

    // Load users on component mount or when adminKey changes
    useEffect(() => {
        loadUsers();
    }, [adminKey]);

    // Fetch list of employees and update state
    const loadUsers = async () => {
        const fetchedUsers = await getEmployees();
        setUsers(fetchedUsers);
    };

    // Toggle admin status of a user, preventing self-demotion
    const handleAdminToggle = async (user) => {
        if (user.UserName === adminKey) {
            alert("You cannot revoke your own admin privileges.");
            return;
        }

        const isAdminInt = typeof user.IsAdmin === 'boolean' ? (user.IsAdmin ? 1 : 0) : parseInt(user.IsAdmin, 10);
        const updatedUser = { ...user, IsAdmin: isAdminInt === 1 ? 0 : 1 };

        await updateUserAdminStatus(updatedUser);
        await loadUsers(); // Refresh the user list after update
    };

    // New function to handle password reset
    const handleResetPassword = async (user) => {
        const newPassword = 'password'; // Default password
        alert(`Employee's password has been reset to '${newPassword}'`);
        await updateUserPassword(user.UserName, newPassword);
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <h1>Administrator Management</h1>
            <Line />
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 0.7fr 1fr",
                gap: "1rem",
                alignItems: "center",
                maxHeight: "600px",
                overflowY: "auto",
            }}>
                <h4>Username</h4>
                <h4>Name</h4>
                <h4>Email</h4>
                <h4>Is Admin</h4>
                <h4>Admin Status</h4>

                {users.map(user => (
                    <React.Fragment key={user.UserName}>
                        <div style={{
                            backgroundColor: user.UserName === adminKey ? '#D59C36' : 'transparent',
                            color: user.UserName === adminKey ? 'black' : 'inherit',
                            padding: user.UserName === adminKey ? '0.5rem' : '0',
                            borderRadius: user.UserName === adminKey ? '5px' : '0',
                        }}>{user.UserName}</div>

                        <div style={{
                            backgroundColor: user.UserName === adminKey ? '#D59C36' : 'transparent',
                            color: user.UserName === adminKey ? 'black' : 'inherit',
                            padding: user.UserName === adminKey ? '0.5rem' : '0',
                            borderRadius: user.UserName === adminKey ? '5px' : '0',
                        }}>{user.Name}</div>

                        <div style={{
                            backgroundColor: user.UserName === adminKey ? '#D59C36' : 'transparent',
                            color: user.UserName === adminKey ? 'black' : 'inherit',
                            padding: user.UserName === adminKey ? '0.5rem' : '0',
                            borderRadius: user.UserName === adminKey ? '5px' : '0',
                        }}>{user.Email}</div>

                        <div style={{
                            backgroundColor: user.UserName === adminKey ? '#D59C36' : 'transparent',
                            color: user.UserName === adminKey ? 'black' : 'inherit',
                            padding: user.UserName === adminKey ? '0.5rem' : '0',
                            borderRadius: user.UserName === adminKey ? '5px' : '0',
                        }}>{user.IsAdmin ? 'true' : 'false'}</div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {user.UserName !== sessionData.username && (
                                <button onClick={() => handleAdminToggle(user)}>
                                    {user.IsAdmin === true ? 'Revoke Admin' : 'Grant Admin'}
                                </button>
                            )}
                            <button onClick={() => handleResetPassword(user)} style={{ marginTop: '0.5rem' }}>
                                Reset Password
                            </button>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default AdminManagement;
