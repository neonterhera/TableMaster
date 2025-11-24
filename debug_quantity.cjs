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
        // Check first 3 bookings for quantity field
        for (let i = 0; i < Math.min(3, bookings.length); i++) {
            const booking = bookings[i];
            console.log(`\n=== Booking ${i + 1} ===`);
            console.log('Name:', booking.firstName, booking.lastName);
            console.log('Quantity field:', booking.quantity);
            console.log('All keys:', Object.keys(booking));

            // Check if quantity is nested somewhere
            if (booking.tickets) {
                console.log('Tickets:', JSON.stringify(booking.tickets, null, 2));
            }
        }
    }
} catch (e) {
    console.error('Error:', e.message);
}
