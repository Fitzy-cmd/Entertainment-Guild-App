import PromoSection from "../components/PromoSection";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
    const subtitleStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
    return (<>
        <PromoSection />
        <hr style={{
            border: 'none',
            background: 'none',
            boxShadow: '0 -1px 0 #D59C36',
            marginTop: '1rem',
            height: '1px', // Adjust the height as needed
            width: '100%', // Adjust the width as needed
        }} />
        <h2 style={subtitleStyle}>Featured Products</h2>
        <ProductGrid
            rows={1}
            columns={5}
            useRandom={true} />
    </>)
}