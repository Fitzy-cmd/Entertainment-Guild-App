import { useState, useEffect } from "react"
import React from "react"
import "./stylesheets/ImageSlider.css"

export default function ImageSlider({ slides }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Preload the next image to enhance the user experience during transitions
        const nextIndex = (currentIndex + 1) % slides.length;
        const img = new Image();
        img.src = slides[nextIndex].url;
    }, [currentIndex, slides]);

    const slideStyle = {
        backgroundImage: `url(${slides[currentIndex].url})`,
        height: "100%",
        width: "100%",
        borderRadius: '10px',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    };

    // Navigate to the previous slide, looping back to the last slide if at the start
    function goToPrev() {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    // Navigate to the next slide, looping back to the first slide if at the end
    function goToNext() {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    // Set the current slide based on the provided index
    function goToSlide(index) {
        setCurrentIndex(index);
    }

    return (
        <div className="container">
            <div className="slider">
                <div className="left-arrow" onClick={goToPrev}>❰</div>
                <div className="right-arrow" onClick={goToNext}>❱</div>
                <div style={slideStyle} />
                <div className="dot-container">
                    {slides.map((slide, index) => (
                        <div className="dot" key={index} onClick={() => goToSlide(index)}>⬤</div>
                    ))}
                </div>
            </div>
        </div>
    )
}