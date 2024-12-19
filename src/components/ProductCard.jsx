import "./stylesheets/ProductCard.css"
import CustomLink from "./CustomLink";

export default function ProductCard({
    imgSrc = "/product/ProductPlaceholder.webp",
    imgAlt = "Placeholder",
    title,
    desc = "Example Description",
    buttonText = "Check it out!",
    link
}) {
    return (
        <div className="card-container">
            <div className="image-container">
                {imgSrc && <img className="image" src={imgSrc} alt={imgAlt} />}
            </div>
            <div className="product-details">
                <h3 className="title" style={{ fontSize: "1.2rem", margin: "0.3rem 5%" }}>{title}</h3>
                <p className="description">{truncateText(desc, 75)}</p>
            </div>
            <CustomLink className="link" to={link}>{buttonText}</CustomLink>
        </div>
    );
}

// truncates text to a certain length, then adds '...' to the end
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}