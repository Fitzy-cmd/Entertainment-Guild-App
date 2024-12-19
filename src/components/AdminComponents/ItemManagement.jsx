import Line from "../Line";
import React, { useState, useEffect } from 'react';
import { getAdminItems, getAllCategoriesAndSubcategories, getAllSources, getStocktake } from '../../helpers/GetAPI';
import { updateItem, addNewItem, deleteItem } from '../../helpers/PostAPI'

const ItemManagement = ({ adminKey }) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formDisabled, setFormDisabled] = useState(true);
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState({});
    const [selectedPublicationDate, setSelectedPublicationDate] = useState('');
    const [allSources, setAllSources] = useState([]);
    const [itemSources, setItemSources] = useState([]);
    const [sourceMap, setSourceMap] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemAuthor, setItemAuthor] = useState('');
    const [itemDescription, setItemDescription] = useState('');

    // Load categories, items, and sources on initial mount and whenever adminKey changes
    useEffect(() => {
        async function getCategories() {
            const fetchedCategories = await getAllCategoriesAndSubcategories();
            setCategories(fetchedCategories);

            // Set default category and subcategory
            const firstCategory = Object.keys(fetchedCategories)[0];
            if (firstCategory) {
                setSelectedCategory(firstCategory);
                setSubcategories(fetchedCategories[firstCategory]);
                setSelectedSubcategory(Object.keys(fetchedCategories[firstCategory])[0] || '');
            }
        }

        async function retrieveSources() {
            const fetchedSources = await getAllSources();
            setAllSources(fetchedSources.data.list);

            // Map source names to IDs for lookup
            const map = fetchedSources.data.list.reduce((acc, source) => {
                acc[source.SourceName] = source.Sourceid;
                return acc;
            }, {});
            setSourceMap(map);
        }

        getItems();
        getCategories();
        retrieveSources();
    }, [adminKey]);

    // Update subcategories when selectedCategory changes
    useEffect(() => {
        if (selectedCategory && categories[selectedCategory]) {
            setSubcategories(categories[selectedCategory]);
            setSelectedSubcategory(Object.keys(categories[selectedCategory])[0] || '');
        } else {
            setSubcategories({});
            setSelectedSubcategory('');
        }
    }, [selectedCategory, categories]);

    // Retrieve stocktake data for a specific item
    const getItemStocktake = async (itemId) => {
        const stocktakeData = await getStocktake(itemId);
        return stocktakeData;
    };

    // Load item details and set relevant state values for editing
    const handleViewDetails = async (itemData, item) => {
        setSelectedItem(itemData);
        setFormDisabled(false);

        const itemCategory = item.Category.toLowerCase();
        const itemSubcategory = item.Subcategory;

        setSelectedCategory(itemCategory);
        setSelectedPublicationDate(itemData.Published.split('T')[0] || '');

        setItemName(itemData.Name);
        setItemAuthor(itemData.Author);
        setItemDescription(itemData.Description);

        if (itemCategory in categories) {
            setSubcategories(categories[itemCategory]);
            setSelectedSubcategory(itemSubcategory);
        } else {
            setSubcategories({});
            setSelectedSubcategory('');
        }

        const stocktake = await getItemStocktake(itemData.ID);
        setItemSources(stocktake.map(item => ({
            SourceId: item.SourceId,
            Quantity: item.Quantity || '',
            Price: item.Price || ''
        })));
    };

    // Save updated or new item details
    const handleSaveItem = (save) => {
        const timestamp = new Date().toISOString();

        const dataToSave = {
            ID: selectedItem ? selectedItem.ID : null,
            Name: itemName,
            Author: itemAuthor,
            Description: itemDescription,
            Category: selectedCategory,
            Subcategory: selectedSubcategory,
            Published: selectedPublicationDate,
            Sources: allSources.map(source => {
                const stocktake = itemSources.find(item => item.SourceId === source.Sourceid);
                const quantity = stocktake ? stocktake.Quantity : '';
                const price = stocktake ? stocktake.Price : '';
                const sourceId = sourceMap[source.SourceName];

                if (quantity || price) {
                    return {
                        SourceName: source.SourceName,
                        SourceId: sourceId,
                        Quantity: quantity,
                        Price: price,
                    };
                }
                return null;
            }).filter(source => source !== null),
            LastUpdated: timestamp,
            LastUpdatedBy: JSON.parse(localStorage.getItem('sessionData')).username,
        };

        if (save) {
            updateItem(dataToSave);
        } else {
            addNewItem(dataToSave);
        }

        getItems();
    };

    // Confirm and delete an item, then refresh the list
    const handleDeleteItem = async (itemData) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the item with ID: ${itemData.ID}?`);
        if (confirmDelete) {
            await deleteItem(itemData);
            getItems();
        }
    };

    // Fetch all items for admin view
    const getItems = async () => {
        const fetchedItems = await getAdminItems(adminKey);
        const flattenedItems = fetchedItems.flat();
        setItems(flattenedItems);
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <h1>Item Management</h1>
            <Line />
            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr",
                gap: "1rem",
                alignItems: "center",
                maxHeight: "600px",
                overflowY: "auto",
            }}>
                <h4>Product ID</h4>
                <h4>Name</h4>
                <h4>Author</h4>
                <h4>Description</h4>
                <h4>Genre/Subgenre</h4>
                <h4>Published On</h4>
                <h4>Sources</h4>
                <h4>Last Updated</h4>

                {items.map(item => {
                    const itemData = item[0];
                    return (
                        <React.Fragment key={itemData.ID}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                <div>{itemData.ID}</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <button onClick={() => handleViewDetails(itemData, item)}>View/Edit</button>
                                    <button onClick={() => handleDeleteItem(itemData, item)}>Delete</button>
                                </div>
                            </div>
                            <div>{itemData.Name}</div>
                            <div>{itemData.Author || 'N/A'}</div>
                            <div>{itemData.Description ? itemData.Description.slice(0, 150) + (itemData.Description.length > 150 ? '...' : '') : 'N/A'}</div>
                            <div>{item.Category ? `${item.Category} / ${item.Subcategory || ''}` : 'N/A'}</div>
                            <div>{new Date(itemData.Published).toLocaleString() || 'N/A'}</div>
                            <div>{item.Sources ? item.Sources.join(', ') : 'N/A'}</div>
                            <div>{new Date(itemData.LastUpdated).toLocaleString() || 'N/A'}</div>
                        </React.Fragment>
                    );
                })}
            </div>

            <h1>View and Edit an Item</h1>
            <Line />

            <form>
                <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '3rem' }}>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Name</label>
                        <input
                            type="text"
                            disabled={formDisabled}
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0rem 1rem', margin: 0, color: 'white' }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Author</label>
                        <input
                            type="text"
                            disabled={formDisabled}
                            value={itemAuthor}
                            onChange={(e) => setItemAuthor(e.target.value)}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0rem 1rem', margin: 0, color: 'white' }}
                        />
                    </div>
                    <div style={{ paddingRight: '1rem' }}>
                        <label style={{ fontSize: '1.5rem' }}>Description</label>
                        <input
                            type="text"
                            disabled={formDisabled}
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0rem 1rem', margin: 0, color: 'white' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '1.5rem' }}>
                    <div style={{ paddingRight: '1rem', flex: 1 }}>
                        <label style={{ display: 'block' }}>Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            disabled={formDisabled}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0.5rem 1rem', margin: 0, color: 'black', width: '100%', height: '3rem', backgroundColor: '#141414', color: 'white', fontSize: '1rem' }}
                        >
                            {Object.keys(categories).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ paddingRight: '1rem', flex: 1 }}>
                        <label style={{ display: 'block' }}>Subcategory</label>
                        <select
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            disabled={formDisabled}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0.5rem 1rem', margin: 0, color: 'black', width: '100%', height: '3rem', backgroundColor: '#141414', color: 'white', fontSize: '1rem' }}
                        >
                            {Object.keys(subcategories).map(subcategory => (
                                <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '2.5rem' }}>
                    <div style={{ paddingRight: '1rem', flex: 1 }}>
                        <label style={{ fontSize: '1.5rem' }}>Published</label>
                        <input
                            type="date"
                            value={selectedPublicationDate}
                            onChange={(e) => setSelectedPublicationDate(e.target.value)}
                            disabled={formDisabled}
                            style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0rem 1rem', margin: 0, color: 'white' }}
                        />
                    </div>
                </div>

                <div style={{ paddingBottom: '1rem' }}>
                    <label style={{ fontSize: '1.5rem' }}>Sources</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {allSources.map(source => {
                            const stocktake = itemSources.find(item => item.SourceId === source.Sourceid) || { Quantity: '', Price: '' };

                            return (
                                <div key={source.Sourceid} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <span>{source.SourceName}</span>
                                    <input
                                        type="number"
                                        value={stocktake.Quantity}
                                        onChange={(e) => {
                                            const quantity = e.target.value;
                                            setItemSources(prev => {
                                                const newSources = [...prev];
                                                const existingStocktake = newSources.find(item => item.SourceId === source.Sourceid);

                                                if (existingStocktake) {
                                                    existingStocktake.Quantity = quantity; // Update quantity
                                                } else {
                                                    newSources.push({ SourceId: source.Sourceid, Quantity: quantity, Price: '' }); // Add new entry
                                                }

                                                return newSources;
                                            });
                                        }}
                                        placeholder="Quantity"
                                        disabled={formDisabled}
                                        style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0.5rem', color: 'white' }}
                                    />
                                    <input
                                        type="number"
                                        value={stocktake.Price}
                                        onChange={(e) => {
                                            const price = e.target.value;
                                            setItemSources(prev => {
                                                const newSources = [...prev];
                                                const existingStocktake = newSources.find(item => item.SourceId === source.Sourceid);

                                                if (existingStocktake) {
                                                    existingStocktake.Price = price; // Update price
                                                } else {
                                                    newSources.push({ SourceId: source.Sourceid, Quantity: '', Price: price }); // Add new entry
                                                }

                                                return newSources;
                                            });
                                        }}
                                        placeholder="Price"
                                        disabled={formDisabled}
                                        style={{ borderRadius: '4px', border: '1px solid #D59C36', padding: '0.5rem', color: 'white' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </form>

            <div style={{ display: 'flex' }}>
                <button onClick={() => handleSaveItem(false)} disabled={formDisabled} style={{ marginRight: '1rem' }}>Add as New Item</button>
                <button onClick={() => handleSaveItem(true)} disabled={formDisabled}>Save to Existing Item</button>
            </div>
        </div>
    );
}

export default ItemManagement;
