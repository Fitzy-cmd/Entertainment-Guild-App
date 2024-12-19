import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import * as Icons from 'react-icons/fa';
import "./stylesheets/StylisedRadio.css";

export default function StylisedRadio({ 
    options, 
    iconNames = [], 
    defaultSelection = 0, 
    inactiveColour = "#553F16", 
    activeColour = "#D59C36",
    columnStyle = false,
    onOptionSelect 
}) {
    const [selectedIndex, setSelectedIndex] = useState(defaultSelection);

    const handleSelect = (index) => {
        setSelectedIndex(index); // Update selected index
        if (onOptionSelect) {
            onOptionSelect(index); // Notify parent of the selected option
        }
    };

    const active = {
        backgroundColor: activeColour,
        transition: "0.3s",
        '&:hover': {
            backgroundColor: activeColour,
            cursor: 'pointer'
        }
    };

    const inactive = { 
        backgroundColor: inactiveColour,
        transition: "0.3s",
        '&:hover': {
            backgroundColor: activeColour,
            cursor: 'pointer'
        }
    };

    return (
        <Box className="variation-container" sx={{ ...(columnStyle ? { display: 'flex', flexDirection: 'column' } : {}) }}>
            {options.map((option, index) => (
                <Box
                    key={index}
                    onClick={() => handleSelect(index)}
                    sx={{
                        padding: "0.5rem 2rem",
                        marginTop: "1rem",
                        marginRight: "1rem",
                        display: 'flex',
                        ...(selectedIndex === index ? active : inactive),
                    }}
                >
                    {iconNames[index] && Icons[iconNames[index]] && (
                        React.createElement(Icons[iconNames[index]], { style: { fontSize: '1.5em', marginRight: '0.5rem' } })
                    )}
                    <Typography variant="body1" sx={{ fontSize: 'inherit' }}>{option}</Typography>
                </Box>
            ))}
        </Box>
    );
}
