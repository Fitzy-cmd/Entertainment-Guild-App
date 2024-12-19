import React from 'react';
import "./stylesheets/FormFill.css";
import { useState } from "react";

export default function FormFill({ placeholders, passwordIndexes, onFormChange }) {
    const [inputValues, setInputValues] = useState({});

    // manages input change when entering inputs
    const handleInputChange = (event, index) => {
        const { value } = event.target;
        const updatedValues = {
            ...inputValues,
            [`input-${index}`]: value,
        };
        setInputValues(updatedValues);
        onFormChange(updatedValues);  // Update the parent component with the new form data
    };

    return (
        <div className='form-container'>
            {placeholders.map((placeholder, index) => (
                <div className="input-field" key={index}>
                    <input
                        id={`input-${index}`}
                        type={passwordIndexes.includes(index) ? "password" : "text"}
                        placeholder={placeholder}
                        value={inputValues[`input-${index}`] || ""}
                        onChange={(event) => handleInputChange(event, index)}
                        onBlur={(event) => handleInputChange(event, index)}  // Ensure the latest value is captured on blur
                    />
                </div>
            ))}
        </div>
    );
}

