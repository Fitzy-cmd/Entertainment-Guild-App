// CostBreakdown.js
import Line from "./Line";

const CostBreakdown = ({ subtotal }) => {
    // styling
    const breakdownLineStyle = {
        display: 'flex',
        justifyContent: "space-between"
    };

    return (
        <div className="cost-breakdown" style={{ padding: "1rem" }}>
            <div style={{ margin: '0 auto' }}>
                <Line />
                <div style={breakdownLineStyle}>
                    <div style={{ fontSize: '1.3rem' }}>PRODUCT TOTAL</div>
                    <div style={{ fontSize: '1.3rem' }}>${((subtotal / 110) * 100).toFixed(2)}</div>
                </div>

                <div style={breakdownLineStyle}>
                    <div style={{ fontSize: '0.9rem' }}>SURCHARGE</div>
                    <div style={{ fontSize: '0.9rem' }}>${((subtotal / 110) * 10).toFixed(2)}</div>
                </div>

                <div style={breakdownLineStyle}>
                    <div style={{ fontSize: '0.9rem' }}>PROMO CODE</div>
                    <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                </div>

                <div style={breakdownLineStyle}>
                    <div style={{ fontSize: '0.9rem' }}>SHIPPING</div>
                    <div style={{ fontSize: '0.9rem' }}>Determined at checkout</div>
                </div>
                <Line />
                <div style={breakdownLineStyle}>
                    <div style={{ fontSize: '1.5rem' }}>SUBTOTAL</div>
                    <div style={{ fontSize: '1.5rem' }}>${subtotal}</div>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdown;
