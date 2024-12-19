import React, { useEffect, useState } from 'react';
import { getEmployeeItems } from '../../helpers/GetAPI'; // Adjust the import path as needed
import Line from "../Line"

const ItemView = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        // Fetch initial set of items and set the total page count
        const fetchItems = async () => {
            try {
                const response = await getEmployeeItems(currentPage, itemsPerPage);
                setItems(response.items);
                if(!totalPages) { setTotalPages(response.maxPages); }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [currentPage]);

    // Display items for the next page
    const handleNext = async () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            refetchItems(newPage);
        }
    };

    // Display items for the previous page
    const handlePrevious = async () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            refetchItems(newPage);
        }
    };

    // Fetch and update items for the specified page
    const fetchItems = async (page) => {
        try {
            const response = await getEmployeeItems(page, itemsPerPage);
            setItems(response.items);
            setTotalPages(response.totalCount);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // Display full item description using an alert dialog
    const showFullDescription = (description) => {
        alert(description);
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <h1>Item View</h1>
            <Line />
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 2fr 1fr 1fr 1fr",
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

                {items.map(item => {
                    const itemData = item[0];
                    return (
                        <React.Fragment key={itemData.ID}>
                            <div>{itemData.ID}</div>
                            <div>{itemData.Name}</div>
                            <div>{itemData.Author || 'N/A'}</div>
                            <div>
                                <div style={{display: 'flex', flexDirection:'column'}}>
                                    {itemData.Description ?
                                        itemData.Description.slice(0, 100) + (itemData.Description.length > 100 ? '...' : '')
                                        : 'N/A'}

                                    <button onClick={() => showFullDescription(itemData.Description)}>Show Full Description</button>
                                </div>
                            </div>
                            <div>{item.Category ? `${item.Category} / ${item.Subcategory || ''}` : 'N/A'}</div>
                            <div>{new Date(itemData.Published).toLocaleString() || 'N/A'}</div>
                            <div>{item.Sources ? item.Sources.join(', ') : 'N/A'}</div>
                        </React.Fragment>
                    );
                })}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNext} disabled={currentPage >= totalPages}>Next</button>
            </div>
        </div>
    );
};

export default ItemView;
