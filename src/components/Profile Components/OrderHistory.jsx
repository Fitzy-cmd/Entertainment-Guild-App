import React, { useEffect, useState } from 'react';
import Line from "../Line";
import { getOrders, getProductDetails, getSourceFromSourceID } from "../../helpers/GetAPI";
import { updateOrder } from "../../helpers/PostAPI"

const OrderHistory = ({ userID }) => {
    const [noOrders, setNoOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orderTotals, setOrderTotals] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: "",
        suburb: "",
        state: "",
        postcode: "",
    });

    // Fetches and updates the user's order history, including order totals
    async function getUserOrders() {
        const orders = await getOrders(userID);
        if (!orders || orders.length === 0) {
            setNoOrders(true);
            setOrders([]);
        } else {
            setNoOrders(false);
            setOrders(orders);
            const initialTotals = {};
            await Promise.all(orders.map(async (order) => {
                const totalCost = await totalProductCost(order);
                initialTotals[order.OrderID] = totalCost;
            }));
            setOrderTotals(initialTotals);
        }
    }

    useEffect(() => {
        getUserOrders();
    }, [userID]);

    // Calculates total cost for each order by fetching individual product prices
    async function totalProductCost(order) {
        let orderTotal = 0.0;
        const idList = order["Stocktake List"].map((p) => p.ItemId).join(",");
        const productPrices = await Promise.all(idList.split(",").map(async (id) => {
            const product = await getProductDetails(id);
            return parseFloat(product[0].Price);
        }));

        orderTotal = productPrices.reduce((sum, price) => sum + price, 0);
        return orderTotal;
    }

    // Displays product names and sources for each item in the order
    async function showProducts(order) {
        const idList = order["Stocktake List"].map((i) => i.ItemId).join(",");
        const stocktakeIdList = order["Stocktake List"].map((i) => i.SourceId).join(",");

        const productNames = await Promise.all(idList.split(",").map(async (id) => {
            const product = await getProductDetails(id);
            return product[0].Name;
        }));

        const productSources = await Promise.all(stocktakeIdList.split(",").map(async (id) => {
            const source = await getSourceFromSourceID(id);
            return source;
        }));

        const productList = productNames.map((name, index) => {
            const source = productSources[index] || "Unknown Source";
            return `${name} (${source})`;
        });

        alert(productList.join("\n"));
    }

    const buttonStyle = {
        transition: '0.3s',
        backgroundColor: '#553F16',
        padding: '0.5rem 2rem',
        width: 'fit-content',
        color: 'white',
        cursor: 'pointer',
        border: 'none',
    };

    // Updates button color on hover
    const handleMouseOver = (e) => {
        e.target.style.backgroundColor = '#D59C36';
    };

    const handleMouseOut = (e) => {
        e.target.style.backgroundColor = '#553F16';
    };

    // Initializes address fields for editing a specific order
    const handleEdit = (orderID) => {
        const orderToEdit = orders.find(order => order.OrderID === orderID);
        setEditingOrder(orderID);
        setNewAddress({
            street: orderToEdit.StreetAddress,
            suburb: orderToEdit.Suburb,
            state: orderToEdit.State,
            postcode: orderToEdit.PostCode,
        });
    };

    // Saves address changes to the specified order and refreshes order data
    const handleSave = (orderID) => {
        updateOrder(orderID, newAddress.street, newAddress.suburb, newAddress.state, newAddress.postcode)
        setOrders((prevOrders) =>
            prevOrders.map(order =>
                order.OrderID === orderID ? { ...order, ...newAddress } : order
            )
        );
        setEditingOrder(null);
        getUserOrders();
    };

    // Cancels editing mode for the current order
    const handleCancel = () => {
        setEditingOrder(null);
    };

    // Tracks changes to address fields during editing
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    return (
        <div style={{ padding: "0rem 2rem", width: "100%" }}>
            <div style={{
                overflowY: "auto",
                maxHeight: "500px",
                border: "none",
            }}>
                <h1>Order History</h1>
                <Line />
                {noOrders ? (
                    <div>No orders found.</div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 3fr 1fr 1fr 1fr",
                        gap: "1rem",
                        alignItems: "center"
                    }}>
                        <h4>Order ID</h4>
                        <h4>Address</h4>
                        <h4>Number of Products</h4>
                        <h4>Price</h4>
                        <h4>Details</h4>

                        {orders.map((order) => (
                            <React.Fragment key={order.OrderID}>
                                <div>{order.OrderID}</div>
                                <div>
                                    {editingOrder === order.OrderID ? (
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <input
                                                type="text"
                                                name="street"
                                                value={newAddress.street}
                                                onChange={handleChange}
                                                placeholder="Street Address"
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #D59C36',
                                                    padding: '0rem 0rem',
                                                    margin: 0,
                                                    color: 'white'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="suburb"
                                                value={newAddress.suburb}
                                                onChange={handleChange}
                                                placeholder="Suburb"
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #D59C36',
                                                    padding: '0rem 0rem',
                                                    margin: 0,
                                                    color: 'white'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={newAddress.state}
                                                onChange={handleChange}
                                                placeholder="State"
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #D59C36',
                                                    padding: '0rem 0rem',
                                                    margin: 0,
                                                    color: 'white'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="postcode"
                                                value={newAddress.postcode}
                                                onChange={handleChange}
                                                placeholder="Postcode"
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #D59C36',
                                                    padding: '0rem 0rem',
                                                    margin: 0,
                                                    color: 'white'
                                                }}
                                            />
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <button onClick={() => handleSave(order.OrderID)}>Save</button>
                                                <button onClick={handleCancel}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ whiteSpace: "pre-wrap" }}>
                                            {`${order.StreetAddress}, ${order.Suburb}, ${order.State}, ${order.PostCode}`}
                                            <button style={{ marginLeft: "1rem" }} onClick={() => handleEdit(order.OrderID)}>Edit</button>
                                        </div>
                                    )}
                                </div>
                                <div>{order["ProductsInOrders List"].length}</div>
                                <div>${orderTotals[order.OrderID] ? orderTotals[order.OrderID].toFixed(2) : "Loading..."}</div>
                                <button style={buttonStyle}
                                    onMouseOver={handleMouseOver}
                                    onMouseOut={handleMouseOut}
                                    onClick={() => showProducts(order)}>Product List</button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
