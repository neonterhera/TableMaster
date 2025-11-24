const fs = require('fs');

try {
    let content = fs.readFileSync('bookings_dump.json', 'utf16le');
    const firstChar = content.search(/[\{\[]/);
    if (firstChar !== -1) {
        content = content.slice(firstChar);
    }

    const bookings = JSON.parse(content);
    console.log('Total bookings:', bookings.length);

    if (bookings.length > 0) {
        const first = bookings[0];
        console.log('\n=== FIELD MAPPING ===');
        console.log('ID field:', first.uid);
        console.log('Guest name:', first.firstName, first.lastName);
        console.log('Guest email:', first.email);
        console.log('Guest phone:', first.telephone);
        console.log('Party size (quantity):', first.quantity);
        console.log('Booking date/time:', first.bookingDateTime);
        console.log('Duration:', first.bookingDuration);
        console.log('Tables:', first.tables?.map(t => t.name).join(', '));
        console.log('\n=== ALL KEYS ===');
        console.log(Object.keys(first).join(', '));
    }
} catch (e) {
    console.error('Error:', e.message);
}
