import axios from 'axios';
import { getCategoryMappings, getSubcategoryMappings } from './GetAPI'
import {sha256} from './HandleLogin'


const baseURL = "";
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'xc-token': ''
};
// Updates the name of a user identified by userID
const updateName = (userID, newName) => {
    fetch(`${baseURL}Patrons/${userID}`, {
        method: 'PATCH',
        headers: headers,  // Set appropriate headers for the request
        body: JSON.stringify({
            "Name": newName  // Payload containing the new name
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => console.log("Success:", data)) // Log successful update
        .catch(error => console.error('Error:', error)); // Log any errors
}

const updatePatronPassword = async (userID, password) => {
    const response = await axios.get(`${baseURL}Patrons/${userID}`, {headers});
    const userSalt = response.data.Salt;
    const newHash = await sha256(userSalt + password)
    console.log(newHash)
    const updateReponse = await axios.patch(`${baseURL}Patrons/${userID}`, {
        HashPW: newHash
    }, { headers })
    .catch(error => console.error("Error updating password:", error));
}

const updateUserPassword = async (username, password) => {
    const response = await axios.get(`${baseURL}User/${username}`, {headers});
    const userSalt = response.data.Salt;
    const newHash = await sha256(userSalt + password)
    console.log(newHash)
    const updateReponse = await axios.patch(`${baseURL}User/${username}`, {
        HashPW: newHash
    }, { headers })
    .catch(error => console.error("Error updating password:", error));
}

// Updates the email of a user identified by userID
const updateEmail = (userID, newEmail) => {
    fetch(`${baseURL}Patrons/${userID}`, {
        method: 'PATCH',
        headers: headers,  // Set appropriate headers for the request
        body: JSON.stringify({
            "Email": newEmail  // Payload containing the new email
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => console.log("Success:", data)) // Log successful update
        .catch(error => console.error('Error:', error)); // Log any errors
}

// Updates the address details of an order identified by orderID
const updateOrder = (orderID, streetAddress, suburb, state, postcode) => {
    fetch(`${baseURL}Orders/${orderID}`, {
        method: 'PATCH',
        headers: headers,  // Set appropriate headers for the request
        body: JSON.stringify({
            "StreetAddress": streetAddress,
            "Suburb": suburb,
            "State": state,
            "PostCode": postcode  // Payload containing the new address details
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => console.log("Success:", data)) // Log successful update
        .catch(error => console.error('Error:', error)); // Log any errors
}

// Deletes a user identified by userID
const deleteUser = (userID) => {
    fetch(`${baseURL}Patrons/${userID}`, {
        method: 'DELETE',
        headers: headers,  // Set appropriate headers for the request
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => console.log("User deleted successfully:", data)) // Log successful deletion
        .catch(error => console.error('Error:', error)); // Log any errors
}

// Adds a new product based on the provided data
const addNewItem = async (data) => {
    // Map categories and subcategories for product details
    const categoryMap = getCategoryMappings();
    const subcatMap = await getSubcategoryMappings(categoryMap[data.Category]);

    // Create a new product
    const newProductResponse = await axios.post(`${baseURL}Product`, {
        Name: data.Name,
        Author: data.Author || '',  // Default to empty if not provided
        Description: data.Description || '',  // Default to empty if not provided
        Genre: parseInt(categoryMap[data.Category]) || '',  // Convert genre to integer
        SubGenre: parseInt(subcatMap[data.Subcategory]) || '',  // Convert subgenre to integer
        Published: data.Published,
        LastUpdatedBy: data.LastUpdatedBy,
        LastUpdated: data.LastUpdated,
    }, { headers });

    const newProductId = newProductResponse.data.ID; // Get the ID of the newly created product

    // Handle stocktakes for the new product
    await updateStocktakesForNewItem(newProductId, data.Sources);
}

// Updates stocktakes for a new item
const updateStocktakesForNewItem = async (productId, sources) => {
    const sourcesToAdd = sources.map(source => ({
        SourceId: source.SourceId,
        ProductId: productId,
        Quantity: source.Quantity,
        Price: source.Price,
    }));

    // Add new sources using POST
    await Promise.all(
        sourcesToAdd.map(source =>
            axios.post(`${baseURL}Stocktake`, {
                SourceId: source.SourceId,
                ProductId: source.ProductId,
                Quantity: source.Quantity,
                Price: source.Price,
            }, { headers }) // Set appropriate headers for the request
        )
    );
}

// Updates an existing product based on the provided data
const updateItem = async (data) => {
    await updateStocktakes(data); // Update stocktakes for the item
    const categoryMap = getCategoryMappings(); // Map categories
    const subcatMap = await getSubcategoryMappings(categoryMap[data.Category]); // Map subcategories

    // Update product details via PATCH
    await axios.patch(`${baseURL}Product/${data.ID}`, {
        Name: data.Name,
        Author: data.Author || '',  // Default to empty if not provided
        Description: data.Description || '',  // Default to empty if not provided
        Genre: parseInt(categoryMap[data.Category]) || '',  // Convert genre to integer
        SubGenre: parseInt(subcatMap[data.Subcategory]) || '',  // Convert subgenre to integer
        Published: data.Published,
        LastUpdatedBy: data.LastUpdatedBy,
        LastUpdated: data.LastUpdated,
    }, { headers });
}

// Updates stocktakes based on the provided data
const updateStocktakes = async (data) => {
    // Retrieve existing stocktake records for the product
    const existingStocktake = await (await axios.get(`${baseURL}Stocktake?where=(ProductId,eq,${data.ID})`, { headers })).data.list;
    const stocktakeMap = existingStocktake.reduce((map, entry) => {
        map[entry.SourceId] = entry; // Map stocktake entries by SourceId for easy access
        return map;
    }, {});

    var sourcesToUpdate = [];
    var sourcesToAdd = [];
    var sourcesToDelete = [];

    // Determine sources to update, add, or delete
    data.Sources.forEach(newSource => {
        const existingEntry = stocktakeMap[newSource.SourceId];

        if (existingEntry) {
            // Source exists, check if it needs updating
            if (existingEntry.Quantity !== newSource.Quantity || existingEntry.Price !== newSource.Price) {
                sourcesToUpdate.push({
                    ...existingEntry,
                    Quantity: newSource.Quantity,
                    Price: newSource.Price,
                });
            }
            delete stocktakeMap[newSource.SourceId]; // Remove from map for deletion check
        } else {
            // Source does not exist, prepare to add it
            sourcesToAdd.push({
                SourceId: newSource.SourceId,
                ProductId: data.ID,
                Quantity: newSource.Quantity,
                Price: newSource.Price,
            });
        }
    });

    // Remaining entries in stocktakeMap are sources to delete
    for (const remainingSourceId in stocktakeMap) {
        sourcesToDelete.push(stocktakeMap[remainingSourceId].ItemId);
    }

    // Perform API calls to update, add, and delete stocktake sources
    await Promise.all([
        // Update existing sources using PATCH
        ...sourcesToUpdate.map(source =>
            axios.patch(`${baseURL}Stocktake/${source.ItemId}`, {
                Quantity: source.Quantity,
                Price: source.Price,
            }, { headers }) // Include headers here
        ),

        // Add new sources using POST
        ...sourcesToAdd.map(source =>
            axios.post(`${baseURL}Stocktake`, {
                SourceId: source.SourceId,
                ProductId: source.ProductId,
                Quantity: source.Quantity,
                Price: source.Price,
            }, { headers }) // Include headers here
        ),

        // Delete sources using DELETE
        ...sourcesToDelete.map(itemId =>
            axios.delete(`${baseURL}Stocktake/${itemId}`, { headers }) // Include headers here
        ),
    ]);
}

// Adds a new user with the provided data
const addNewUser = async (data) => {
    try {
        const newUserResponse = await axios.post(`${baseURL}Patrons`, {
            Email: data.Email,
            Name: data.Name,
            Salt: data.Salt,
            HashPW: data.HashPW
        }, { headers });
    } catch (error) {
        console.error(error); // Log any errors that occur
        alert("Error when creating new user");
        return false; // Indicate failure
    }
    alert("User successfully created! Login to access your new profile!"); // Inform the user of success
    return true; // Indicate success
};

// Updates user details based on the provided data
const updateUser = async (data) => {
    await axios.patch(`${baseURL}Patrons/${data.UserID}`, {
        Email: data.Email,
        Name: data.Name,
        // Add any additional fields here as needed
    }, { headers }); // Include headers for the request
};

// Updates the admin status of a user
const updateUserAdminStatus = async (user) => {
    try {
        await axios.patch(`${baseURL}User/${user.UserName}`, {
            IsAdmin: user.IsAdmin // Update admin status
        }, { headers });
    } catch (error) {
        console.error("Error updating user admin status:", error); // Log any errors
        throw error; // Re-throw the error for handling elsewhere
    }
};

// Deletes an item identified by itemData
const deleteItem = async (itemData) => {
    try {
        await deleteStocktakesByProductId(itemData.ID); // Delete associated stocktakes first
        const response = await axios.delete(`${baseURL}Product/${itemData.ID}`, { headers });
        return response.data; // Return the response for further handling
    } catch (error) {
        console.error('Error deleting item:', error); // Log any errors
        throw error; // Optionally rethrow the error for further handling
    }
};

// Deletes all stocktakes associated with a specific product ID
const deleteStocktakesByProductId = async (productId) => {
    try {
        // Fetch stocktakes for the product
        const response = await axios.get(`${baseURL}Stocktake?where=(ProductId,eq,${productId})`, { headers });
        const stocktakes = response.data.list;

        // Delete each stocktake record
        await Promise.all(stocktakes.map(stocktake =>
            axios.delete(`${baseURL}Stocktake/${stocktake.ItemId}`, { headers }) // Include headers here
        ));

    } catch (error) {
        console.error('Error deleting stocktakes:', error); // Log any errors
        throw error; // Rethrow to handle in the main delete function
    }
};

// Adds a new order based on the provided data and cart items
const addNewOrder = async (data, cart) => {
    let patron = null; // Initialize patron variable
    const sessionData = JSON.parse(localStorage.getItem("sessionData")); // Retrieve session data

    if (sessionData && sessionData.userID) {
        patron = sessionData.userID; // Set patron ID from session data
    }

    // Construct order data
    const TO = {
        PatronId: patron,
        Email: data.email,
        PhoneNumber: data.phone,
        StreetAddress: data.address,
        PostCode: parseInt(data.postcode),
        Suburb: data.city,
        State: data.state,
        CardNumber: data.cardNumber,
        CardOwner: data.cardName,
        Expiry: `${data.expMonth}/${String(data.expYear).slice(-2)}`,
        CVV: parseInt(data.cvv),
    };

    try {
        // Create Transaction Order (TO)
        const newTO = await axios.post(`${baseURL}TO`, TO, { headers });

        // Prepare Order data
        const order = {
            Customer: newTO.data.CustomerID, // Set customer ID from TO
            StreetAddress: data.address,
            PostCode: parseInt(data.postcode),
            Suburb: data.city,
            State: data.state,
        };

        // Create new order
        const newOrderResponse = await axios.post(`${baseURL}Orders`, order, { headers });
        const newOrderId = newOrderResponse.data.OrderID; // Get new order ID

        // Process each item in the cart
        for (const item of cart) {
            const sourceResponse = await axios.get(`${baseURL}Source?where=(SourceName,eq,${item.source})`, { headers });
            const sourceId = sourceResponse.data.list[0]?.Sourceid; // Get the Source ID

            if (sourceId) {
                const stocktakeResponse = await axios.get(`${baseURL}Stocktake?where=(SourceId,eq,${sourceId})~and(ProductId,eq,${item.productID})`, { headers });
                const stocktakeItem = stocktakeResponse.data.list[0]; // Get stocktake item

                if (stocktakeItem) {
                    // Prepare ProductsInOrders entry
                    const productsInOrdersEntry = {
                        OrderId: newOrderId,
                        ProduktId: stocktakeItem.ItemId,
                        Quantity: item.quantity,
                        Orders: {
                            OrderID: newOrderId,
                            Customer: newTO.data.CustomerID // Link to customer from TO
                        },
                        Stocktake: {
                            ItemId: stocktakeItem.ItemId,
                            SourceId: stocktakeItem.SourceId
                        }
                    };
                    // Insert into ProductsInOrders
                    //await axios.post(`${baseURL}ProductsInOrders`, productsInOrdersEntry, { headers });
                    //console.log(`ProductsInOrders entry created for OrderId ${newOrderId} with ProduktId ${stocktakeItem.ItemId}`); // Log successful insertion
                    return true;
                } else {
                    console.error(`Stocktake item not found for Product ID ${item.productID} and Source ID ${sourceId}`); // Log error if stocktake item not found
                }
            } else {
                console.error(`Source not found for source name ${item.source}`); // Log error if source not found
            }
        }
    } catch (error) {
        console.error("Error creating TO entry:", error.response ? error.response.data : error.message);
    }
};


export {
    updateName,
    updateEmail,
    updateOrder,
    deleteUser,
    updateItem,
    addNewItem,
    addNewUser,
    updateUser,
    updateUserAdminStatus,
    deleteItem,
    addNewOrder,
    updatePatronPassword,
    updateUserPassword
};
