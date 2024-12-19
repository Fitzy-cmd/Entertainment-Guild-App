import React, { useState, useEffect } from 'react';
import { Grid, Box, TextField, Typography, Button, MenuItem } from '@mui/material';

const CheckoutForm = ({ validateForm, onFormChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postcode: '',
        phone: '',
        cardName: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        billingPostcode: '',
    });

    // Updates form data and informs parent component of changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        // Pass the updated form data to the parent via the onFormChange callback
        if (onFormChange) {
            onFormChange(updatedFormData);
        }
    };

    // Validates the form whenever the form data changes
    useEffect(() => {
        validateForm(Object.values(formData).every(field => field !== ''));
    }, [formData, validateForm]);

    return (
        <Grid container spacing={2} sx={{ marginTop: "1rem", paddingLeft: 5, backgroundColor: '#141414', borderRadius: '8px', maxWidth: "65%" }}>
            {/* Section 1: Email Entry */}
            <Grid item xs={12}>
                <Box mb={2}>
                    <Typography variant="h5">Contact Information</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        sx={{
                            marginTop: 1,
                            borderRadius: '4px',
                            border: `1px solid #D59C36`,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#D59C36',
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'grey',
                            },
                        }}
                    />
                </Box>
            </Grid>
    
            {/* Personal Information */}
            <Grid item xs={12}>
                <Box mb={2}>
                    <Typography variant="h5">Personal Information</Typography>
                    {/* First Name, Last Name */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                sx={{
                                    marginTop: 1,
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                sx={{
                                    marginTop: 1,
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
    
                    {/* Company (Optional) */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company (Optional)"
                            sx={{
                                marginTop: 1,
                                borderRadius: '4px',
                                border: `1px solid #D59C36`,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D59C36',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'grey',
                                },
                            }}
                        />
                    </Grid>
    
                    {/* Address */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            sx={{
                                marginTop: 1,
                                borderRadius: '4px',
                                border: `1px solid #D59C36`,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D59C36',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'grey',
                                },
                            }}
                        />
                    </Grid>
    
                    {/* Apartment, City, State, Postcode */}
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="apartment"
                                value={formData.apartment}
                                onChange={handleChange}
                                placeholder="Apartment"
                                sx={{
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                sx={{
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                sx={{
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#D59C36',
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Select State</em>
                                </MenuItem>
                                <MenuItem value="NSW">New South Wales</MenuItem>
                                <MenuItem value="VIC">Victoria</MenuItem>
                                <MenuItem value="QLD">Queensland</MenuItem>
                                <MenuItem value="SA">South Australia</MenuItem>
                                <MenuItem value="WA">Western Australia</MenuItem>
                                <MenuItem value="TAS">Tasmania</MenuItem>
                                <MenuItem value="NT">Northern Territory</MenuItem>
                                <MenuItem value="ACT">Australian Capital Territory</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
    
                    {/* Postcode and Phone */}
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                placeholder="Postcode"
                                sx={{
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                sx={{
                                    borderRadius: '4px',
                                    border: `1px solid #D59C36`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D59C36',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'grey',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Grid item xs={12}>
                    <Box mb={2}>
                        <Typography variant="h5">Payment Information</Typography>
                        {/* Row 1: Card Name and Card Number */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    placeholder="Name on Card"
                                    sx={{
                                        marginTop: 1,
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: 'grey',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    placeholder="Card Number"
                                    sx={{
                                        marginTop: 1,
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: 'grey',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
    
                        {/* Row 2: Expiration Month, Expiration Year, CVV, and Billing Postcode */}
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    name="expMonth"
                                    value={formData.expMonth}
                                    onChange={handleChange}
                                    placeholder="Expiration Month"
                                    sx={{
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: '#D59C36', // Change the dropdown arrow color to match outline
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled> {/* Disable to prevent selection */}
                                        <em>Expiration Month</em> {/* Placeholder text */}
                                    </MenuItem>
                                    {[...Array(12)].map((_, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            {index + 1}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    name="expYear"
                                    value={formData.expYear}
                                    onChange={handleChange}
                                    placeholder="Expiration Year"
                                    sx={{
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: '#D59C36', // Change the dropdown arrow color to match outline
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled> {/* Disable to prevent selection */}
                                        <em>Expiration Year</em> {/* Placeholder text */}
                                    </MenuItem>
                                    {Array.from({ length: 10 }, (_, index) => {
                                        const year = new Date().getFullYear() + index;
                                        return (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    placeholder="CVV"
                                    sx={{
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: 'grey',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="billingPostcode"
                                    value={formData.billingPostcode}
                                    onChange={handleChange}
                                    placeholder="Billing Postcode"
                                    sx={{
                                        borderRadius: '4px',
                                        border: `1px solid #D59C36`,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D59C36',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: 'grey',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};




export default CheckoutForm;
