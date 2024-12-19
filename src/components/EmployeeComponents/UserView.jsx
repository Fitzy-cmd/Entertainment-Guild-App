import React, { useState, useEffect } from 'react';
import { getUsers as fetchUsers } from '../../helpers/GetAPI';
import Line from "../Line";

const UserView = ({ adminKey }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // load in all users on page load
    useEffect(() => {
        loadUsers();
    }, [adminKey]);

    // Fetch list of users and update state
    const loadUsers = async () => {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <h1>User View</h1>
            <Line />
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                gap: "1rem",
                alignItems: "center",
                maxHeight: "600px",
                overflowY: "auto",
            }}>
                <h4>User ID</h4>
                <h4>Email</h4>
                <h4>Name</h4>
                {users.map(user => (
                    <React.Fragment key={user.UserID}>
                        <div>{user.UserID}</div>
                        <div>{user.Email}</div>
                        <div>{user.Name || 'N/A'}</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default UserView;
