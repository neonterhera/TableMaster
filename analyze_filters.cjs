const fs = require('fs');

try {
    let content = fs.readFileSync('bookings_dump.json', 'utf16le');
    const firstChar = content.search(/[\{\[]/);
    if (firstChar !== -1) {
        content = content.slice(firstChar);
    }

    const bookings = JSON.parse(content);
    console.log('Total bookings:', bookings.length);

    // Collect all unique statuses and colors (labels)
    const statuses = new Set();
    const colors = new Set();

    bookings.forEach(booking => {
        if (booking.status) statuses.add(booking.status);
        if (booking.color) colors.add(booking.color);
    });

    console.log('\n=== UNIQUE STATUSES ===');
    console.log(Array.from(statuses).join(', '));

    console.log('\n=== UNIQUE COLORS/LABELS ===');
    console.log(Array.from(colors).join(', '));

    // Show examples of each status
    console.log('\n=== EXAMPLES BY STATUS ===');
    statuses.forEach(status => {
        const example = bookings.find(b => b.status === status);
        console.log(`\n${status}:`);
        console.log('  Name:', example.firstName, example.lastName);
        console.log('  Date:', example.bookingDateTime);
        console.log('  Color:', example.color);
    });

} catch (e) {
    console.error('Error:', e.message);
}
