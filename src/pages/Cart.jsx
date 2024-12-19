import CartView from '../components/CartView';
import SubtotalView from '../components/SubtotalView';

const Cart = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ flexGrow: 1 }}>
                <div className="master-cart" style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', margin: '2rem', width: '90%' }}>
                        <h1 style={{ fontSize: '3rem' }}>Your Shopping Cart</h1>
                        <CartView />
                    </div>
                </div>
            </div>
            <div><SubtotalView onCheckout={false} /></div>
        </div>
    )
};

export default Cart;