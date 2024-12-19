import "./stylesheets/PromoSection.css"
import ImageSlider from "./ImageSlider" 


export default function PromoSection() {
    const slides = [
        {url: "/promos/PlaceholderPromo1.webp", title: "Placeholder 1"},
        {url: "/promos/PlaceholderPromo2.webp", title: "Placeholder 2"},
        {url: "/promos/PlaceholderPromo3.webp", title: "Placeholder 3"},
        {url: "/promos/PlaceholderPromo4.webp", title: "Placeholder 4"},
    ]

   return (
    <div className="container">
        <ImageSlider slides={slides} />
    </div>
   )
}