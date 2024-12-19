import axios from 'axios';

const baseURL = "";
const headers = {
    'Accept': 'application/json',
    'xc-token': ''
};

// Map genres to API endpoints
const genreMap = {
    books: "BookGenre",
    games: "GameGenre",
    movies: "MovieGenre"
};

// Memoize the baseURL to avoid unnecessary recalculations
const getFromGenre = async (genre) => {
    if (!genreMap[genre]) {
        throw new Error(`Invalid genre: ${genre}`);
    }

    try {
        const response = await axios.get(`${baseURL}${genreMap[genre]}`, { headers });
        return response.data.list.map(item => item.Name); // Return list of genre names
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error; // Ensure errors propagate for calling function to handle
    }
};

// Fetch a random product, retrying until a valid product is found
// Use while-loop carefully to avoid indefinite looping
const getRandomProduct = async () => {
    try {
        const response = await axios.get(`${baseURL}Product?fields=ID&limit=1`, { headers });
        const total = response.data.pageInfo.totalRows;

        let product = null;
        let attempts = 0;
        const maxAttempts = 10; // Limit retries to prevent infinite loops

        // Retry only a limited number of times to avoid hanging
        while ((!product || product.length === 0) && attempts < maxAttempts) {
            const randomID = Math.floor(Math.random() * total);
            product = await getProductDetails(randomID);
            attempts++;
        }

        if (!product) {
            throw new Error("Failed to retrieve a valid product after several attempts.");
        }

        return product;
    } catch (error) {
        console.error("Error fetching random product:", error);
        throw error; // Propagate the error
    }
};

// Memoize searchProducts to optimize frequent search queries
const searchProducts = async ({
    query = "",
    category = "",
    subcategories = [],
    currentPage
} = {}) => {
    // Defaults ensure that any null values are correctly handled
    query = query || "";
    category = category || "";
    subcategories = Array.isArray(subcategories) ? subcategories : [];
    const displaySize = 9;
    currentPage = currentPage || 1;

    const searchableQuery = query.replace(/\s+/g, '%');

    // category processing
    const categoryMap = getCategoryMappings()
    category = categoryMap[category] || "books"; // Fallback to 'Books'

    // subcategory processing
    const subcategoryMap = await getSubcategoryMappings(category)
    subcategories = subcategories.map(subcategory => subcategoryMap[subcategory])


    try {
        let products;
        // FILTER BY QUERY
        const subGenreFilter = subcategories[0]
            ? `~and(SubGenre,in,${subcategories.join(",")})`
            : '';

        const qResponse = await axios.get(
            `${baseURL}Product?where=(Name,like,%${searchableQuery})~and(Genre,like,${category})${subGenreFilter}&offset=${(currentPage - 1) * displaySize}`,
            { headers }
        );
        products = qResponse.data.list;

        const productIDs = products.map(product => product.ID).slice(0, displaySize);
        return [productIDs, qResponse.data.pageInfo.totalRows]; // Return products and total rows for pagination
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Ensure errors propagate for calling function to handle
    }
};

// Function to retrieve subcategory mappings based on the given category
const getSubcategoryMappings = async (category) => {
    const subcatDict = {};
    const endpoints = {
        1: 'BookGenre',
        3: 'GameGenre',
        2: 'MovieGenre'
    };
    const endpoint = endpoints[category] || 'BookGenre'; // Default to BookGenre if category not found
    const response = await axios.get(`${baseURL}${endpoint}`, { headers });

    // Populate subcategory dictionary with subgenre names and IDs
    response.data.list.forEach(subGenre => {
        subcatDict[subGenre.Name] = subGenre.SubGenreID;
    });

    return subcatDict;
};

// Function to return a mapping of category names to their IDs
const getCategoryMappings = () => {
    const categoryMap = {
        books: 1,
        games: 3,
        movies: 2
    };
    return categoryMap;
}

// Function to fetch product details along with stocktake information for a given product ID
const getProductDetails = async (productID) => {
    try {
        const [productResponse, stocktakeResponse] = await Promise.all([
            axios.get(`${baseURL}Product?where=(ID,eq,${productID})&limit=1`, { headers }),
            axios.get(`${baseURL}Stocktake?where=(ItemId,eq,${productID})&limit=1`, { headers })
        ]);

        const productData = productResponse.data.list;
        const stocktakeData = stocktakeResponse.data.list;

        // Extract price and quantity from stocktake data
        const { Price = null, Quantity = null } = stocktakeData.length > 0 ? stocktakeData[0] : {};

        // Combine product and stocktake data into a single object
        return productData.map(product => ({
            ...product,
            Price,
            Quantity
        }));
    } catch (error) {
        console.error(`Error fetching product details for ID ${productID}:`, error);
        return null; // Return null in case of error
    }
};

// Optimized function to fetch source names using async/await without redundant calls
const getSourceFromID = async (sourceList) => {
    const sources = [];

    // Use Promise.all to fetch all sources concurrently
    await Promise.all(
        sourceList.map(async (item) => {
            try {
                const response = await axios.get(
                    `${baseURL}Source?where=(Sourceid,eq,${item.SourceId})&limit=1`,
                    { headers }
                );
                sources.push(response.data.list[0].SourceName || null); // Handle missing data
            } catch (error) {
                console.error(`Error fetching source with ID ${item.SourceId}:`, error);
                sources.push(null); // Handle errors gracefully
            }
        })
    );

    return sources; // Return an array of source names
};

// Function to fetch a single source name based on its ID
const getSourceFromSourceID = async (id) => {
    try {
        const response = await axios.get(
            `${baseURL}Source?where=(Sourceid,eq,${id})&limit=1`,
            { headers }
        );
        return response.data.list[0].SourceName || null; // Handle missing data
    } catch (error) {
        console.error(`Error fetching source with ID ${id}:`, error);
        return null; // Handle errors gracefully
    }
};

// Function to fetch orders for a specific user based on their ID
const getOrders = async (userID) => {
    try {
        const response = await axios.get(`${baseURL}Patrons?where=(UserID,eq,${userID})`, { headers });

        // Check if there is a TO List and it's not empty
        if (response.data.list.length > 0 && response.data.list[0]['TO List'].length > 0) {
            const toList = response.data.list[0]['TO List'];
            const ordersPromises = toList.map(async (item) => {
                try {
                    const customerID = item.CustomerID;
                    const ordersResponse = await axios.get(`${baseURL}Orders?where=(Customer,eq,${customerID})`, { headers });
                    return ordersResponse.data.list; // Return the orders for this customer
                } catch (error) {
                    console.error(`Failed to fetch orders for CustomerID ${item.CustomerID}:`, error);
                    return []; // Return an empty array for this customer if there's an error
                }
            });

            // Wait for all promises to resolve
            const allOrders = await Promise.all(ordersPromises);
            return allOrders.flat(); // Flatten the array of orders
        } else {
            return []; // Return an empty array if no TO List found
        }
    } catch (error) {
        console.error("Error fetching orders for user:", error);
        throw error; // Ensure errors propagate for the calling function to handle
    }
};

// Function to fetch all sources
const getAllSources = async () => {
    const response = await axios.get(`${baseURL}Source`, { headers });
    return response; // Return the response containing all sources
};

// Function to fetch admin items using the admin key
const getAdminItems = async (adminKey) => {
    try {
        const response = await axios.get(`${baseURL}User/${adminKey}`, { headers });

        const itemList = response.data['Product List'];
        if (!itemList) {
            throw new Error('Product List is undefined in the response.'); // Handle missing product list
        }

        // Function to get sources for a specific item
        const getSourcesForItem = async (item) => {
            const stockList = item[0]['Stocktake List'];
            if (stockList.length > 0) {
                const sourceIDs = stockList.map(source => source.SourceId);
                const sourceResponses = await Promise.all(
                    sourceIDs.map(sourceID => getSourceFromSourceID(sourceID))
                );
                return sourceResponses; // Return the sources found for the item
            }
        };

        // Function to determine the category of an item based on its genre
        const getCategory = (item) => {
            switch (item[0].Genre) {
                case 1: return "Books";
                case 2: return "Movies";
                case 3: return "Games";
                default: return "Unknown";
            }
        };

        // Function to get the subcategory for an item asynchronously
        const getSubcategory = async (item) => {
            const subcatMap = await getSubcategoryMappings(item[0].Genre);
            const reversedSubcatMap = Object.fromEntries(Object.entries(subcatMap).map(([name, id]) => [id, name]));
            return reversedSubcatMap[item[0].SubGenre]; // Return the subcategory name
        };

        // Fetch product details and augment with sources, category, and subcategory
        const productDetailsList = await Promise.all(
            itemList.map(async (item) => {
                const productDetails = await getProductDetails(item.ID);
                const sources = await getSourcesForItem(productDetails);
                const category = getCategory(productDetails);
                const subcategory = await getSubcategory(productDetails);

                return { ...productDetails, Sources: sources, Category: category, Subcategory: subcategory }; // Return enhanced product details
            })
        );

        return productDetailsList; // Return the list of enhanced product details
    } catch (error) {
        console.error('Error fetching admin items:', error);
        throw error; // Re-throw or handle the error as needed
    }
};

// Function to fetch all categories and their corresponding subcategories
const getAllCategoriesAndSubcategories = async () => {
    const categoriesMap = getCategoryMappings();
    const categories = Object.keys(categoriesMap);
    
    // Create an object to hold categories and their corresponding subcategories
    const categoriesWithSubcategories = {};

    // Iterate over each category and fetch subcategories
    for (const category of categories) {
        const categoryId = categoriesMap[category];
        const subcategories = await getSubcategoryMappings(categoryId);
        categoriesWithSubcategories[category] = subcategories; // Store subcategories in the object
    }

    return categoriesWithSubcategories; // Return the categories with their subcategories
};

// Function to fetch stocktake information for a specific item ID
const getStocktake = async (itemID) => {
    const response = await axios.get(`${baseURL}Stocktake?where=(ProductId,eq,${itemID})`, { headers });
    return response.data.list; // Return the stocktake data
}

// Function to fetch all users
const getUsers = async () => {
    const response = await axios.get(`${baseURL}Patrons`, { headers });
    return response.data.list; // Return the list of users
};

// Function to fetch all employees
const getEmployees = async () => {
    try {
        const response = await axios.get(`${baseURL}User`, { headers });
        return response.data.list; // Return the list of employees
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // re-throw the error for handling elsewhere
    }
};

// Function to fetch employee items for pagination
const getEmployeeItems = async (currentPage, itemsPerPage) => {
    try {
        const response = await axios.get(`${baseURL}Product?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`, { headers });
        const itemList = response.data.list;

        if (!itemList) {
            throw new Error('Product List is undefined in the response.'); // Handle missing product list
        }

        // Function to get sources for a specific item
        const getSourcesForItem = async (item) => {
            const stockList = item[0]['Stocktake List'];
            if (stockList.length > 0) {
                const sourceIDs = stockList.map(source => source.SourceId);
                const sourceResponses = await Promise.all(
                    sourceIDs.map(sourceID => getSourceFromSourceID(sourceID))
                );
                return sourceResponses; // Return the sources found for the item
            }
        };

        // Function to determine the category of an item based on its genre
        const getCategory = (item) => {
            switch (item[0].Genre) {
                case 1: return "Books";
                case 2: return "Movies";
                case 3: return "Games";
                default: return "Unknown";
            }
        };

        // Function to get the subcategory for an item asynchronously
        const getSubcategory = async (item) => {
            const subcatMap = await getSubcategoryMappings(item[0].Genre);
            const reversedSubcatMap = Object.fromEntries(Object.entries(subcatMap).map(([name, id]) => [id, name]));
            return reversedSubcatMap[item[0].SubGenre]; // Return the subcategory name
        };

        // Fetch product details and augment with sources, category, and subcategory
        const productDetailsList = await Promise.all(
            itemList.map(async (item) => {
                const productDetails = await getProductDetails(item.ID);
                const sources = await getSourcesForItem(productDetails);
                const category = getCategory(productDetails);
                const subcategory = await getSubcategory(productDetails);

                return { ...productDetails, Sources: sources, Category: category, Subcategory: subcategory }; // Return enhanced product details
            })
        );

        return {
            items: productDetailsList,
            maxPages: Math.ceil(response.data.pageInfo.totalRows / itemsPerPage), // Calculate the maximum number of pages
            currentPage, // Return the current page number
        };
    } catch (error) {
        console.error('Error fetching admin items:', error);
        throw error; // Re-throw or handle the error as needed
    }
};


export {
    getFromGenre,
    getRandomProduct,
    searchProducts,
    getProductDetails,
    getSourceFromID,
    getCategoryMappings,
    getSubcategoryMappings,
    getOrders,
    getSourceFromSourceID,
    getAdminItems,
    getAllCategoriesAndSubcategories,
    getAllSources,
    getStocktake,
    getUsers,
    getEmployees,
    getEmployeeItems
};
