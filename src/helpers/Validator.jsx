function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Validate credit card number
// Example of valid entries: 
// Visa: "4111111111111111" 
// MasterCard: "5111111111111118" 
// American Express: "371449635398431" 
function validateCreditCardNumber(cardNumber) {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/; // Visa
    const masterCardRegex = /^5[1-5][0-9]{14}$/; // MasterCard
    const amexRegex = /^3[47][0-9]{13}$/; // American Express

    return (
        visaRegex.test(cardNumber) ||
        masterCardRegex.test(cardNumber) ||
        amexRegex.test(cardNumber)
    );
}

// Validate credit card expiry date (MM/YY)
// Example of a valid entry: "12/25"
function validateExpiryDate(expiryDate) {
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const [month, year] = expiryDate.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // last two digits of the current year
    const currentMonth = now.getMonth() + 1; // month is 0-indexed

    return expiryDateRegex.test(expiryDate) && (year > currentYear || (year === currentYear && month >= currentMonth));
}

// Validate CVV (3 or 4 digits)
// Example of valid entries: "123" (Visa, MasterCard) or "1234" (American Express)
function validateCVV(cvv) {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
}

// Validate postcode (4 digits for Australian postcodes)
// Example of a valid entry: "2000"
function validatePostcode(postcode) {
    const postcodeRegex = /^[0-9]{4}$/;
    return postcodeRegex.test(postcode);
}

// Validate Australian address (simple check)
// Example of a valid entry: "123 Main St, Sydney, NSW 2000"
function validateAustralianAddress(address) {
    // This is a simplified version; a real-world scenario would require more detailed validation
    return typeof address === 'string' && address.trim().length > 0;
}

// Example of a valid entry: "0412345678"
function validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^04[0-9]{8}$/; // Mobile phone number format
    return phoneNumberRegex.test(phoneNumber);
}

export {
    validateEmail,
    validateCreditCardNumber,
    validateExpiryDate,
    validateCVV,
    validatePostcode,
    validateAustralianAddress,
    validatePhoneNumber,
}