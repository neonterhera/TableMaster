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
        // Collect all unique keys across a few bookings to see if we missed any
        const allKeys = new Set();
        bookings.slice(0, 10).forEach(b => Object.keys(b).forEach(k => allKeys.add(k)));
        console.log('All available keys:', Array.from(allKeys).join(', '));

        // Look for color/label related info
        console.log('\n=== LABEL INFO ===');
        bookings.slice(0, 5).forEach(b => {
            if (b.color) {
                console.log(`Color: ${b.color}`);
                // Check for any other potential label fields
                ['label', 'labels', 'tag', 'tags', 'type', 'category'].forEach(field => {
                    if (b[field]) console.log(`  ${field}:`, JSON.stringify(b[field]));
                });
            }
        });
    }
} catch (e) {
    console.error('Error:', e.message);
}
