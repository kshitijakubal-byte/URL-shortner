function encodeToBase62(input) {
    let dividend = input;
    let hashDigits = [];
    let base = 62;

    while (dividend > 0) {
        let remainder = dividend % base;
        hashDigits.push(remainder);
        dividend = Math.floor(dividend / base);
    }
    // Encode the hashDigits to base62 using the specified character set
    let hashString = '';
    let i = 0;
    while (hashDigits.length > i) {
        let index = parseInt(hashDigits[i]);
        hashString += process.env.BASE62_ENCODING[index];
        i++;
    }
    return hashString;
}

module.exports = {
    encodeToBase62
}

