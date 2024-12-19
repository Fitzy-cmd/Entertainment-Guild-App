import axios from 'axios';

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const HandleLogin = async (username, password) => {
    const token = ''; // Replace with your database token

    try {
        // Attempt to login
        const response = await axios.get(`/Patrons?where=(Email,eq,${username})`, {
            headers: { 'xc-token': token }
        });

        const user = response.data.list[0];
        if (!user) {
            return { success: false, message: "User not found" }; // User not found
        }

        const { Salt, HashPW, UserID, Name, Email } = user;
        const inputHash = await sha256(Salt + password);

        if (inputHash === HashPW) {

            // Store user details (not the password hash)
            const sessionData = { userID: UserID, name: Name, email: Email };
            localStorage.setItem('sessionData', JSON.stringify(sessionData));

            return { success: true, user: sessionData }; // Return user data with success status
        } else {
            return { success: false, message: "Incorrect password" }; // Incorrect password
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Error during login" }; // Handle error
    }
}

const employeeLogin = async (username, password) => {
    const token = '';

    try {
        // Attempt to login
        const response = await axios.get(`/User?where=(Email,eq,${username})`, {
            headers: { 'xc-token': token }
        });

        const user = response.data.list[0];
        if (!user) {
            return { success: false, message: "User not found" }; // User not found
        }

        const { Salt, HashPW, UserName, Name, Email, IsAdmin } = user;
        const inputHash = await sha256(Salt + password);

        if (inputHash === HashPW) {

            // Store user details (not the password hash)
            const sessionData = { username: UserName, name: Name, email: Email };

            localStorage.setItem('sessionData', JSON.stringify(sessionData));

            return { success: true, isAdmin: IsAdmin, sessionData: sessionData }; // Return user data with success status and isAdmin
        } else {
            return { success: false, message: "Incorrect password" }; // Incorrect password
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Error during login" }; // Handle error
    }
}

const checkPassword = async (userID, password) => {
    const token = ''; // Replace with your database token

    try {
        // Attempt to get user details
        const response = await axios.get(`/Patrons?where=(UserID,eq,${userID})`, {
            headers: { 'xc-token': token }
        });

        const user = response.data.list[0];
        if (!user) {
            return { success: false }; // User not found
        }

        const { Salt, HashPW } = user;
        const inputHash = await sha256(Salt + password);

        if (inputHash === HashPW) {
            return { success: true }; // Return user data with success status
        } else {
            return { success: false }
        }
    } catch (error) {
        console.error("Error during password check:", error);
        return { success: false }
    }
}

const logout = (navigate) => {
    localStorage.removeItem("sessionData");
    localStorage.removeItem("token");
    navigate(`/`);
};

const generateSalt = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);

    const saltHex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return saltHex.toString();
};

const validatePassword = async (userID, passwordToCheck) => {
    const token = '';
    const response = await axios.get(`Patrons/${userID}`, {
        headers: { 'xc-token': token }
    });
    const userSalt = response.data.Salt;
    const userHash = response.data.HashPW;
    const hash = await sha256(userSalt + passwordToCheck)
    if(hash === userHash) {
        return true;
    } else {
        return false;
    }
}

const validateEmployeePassword = async (username, passwordToCheck) => {
    const token = '';
    const response = await axios.get(`User/${username}`, {
        headers: { 'xc-token': token }
    });
    const userSalt = response.data.Salt;
    const userHash = response.data.HashPW;
    const hash = await sha256(userSalt + passwordToCheck)
    if(hash === userHash) {
        return true;
    } else {
        return false;
    }
}

export default HandleLogin;

export {
    HandleLogin,
    checkPassword,
    logout,
    employeeLogin,
    sha256,
    generateSalt,
    validatePassword,
    validateEmployeePassword
};
