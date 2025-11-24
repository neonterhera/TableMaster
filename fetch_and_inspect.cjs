const https = require('https');

const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const UID = '91edfa29';
// Calculate today's date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
const url = `https://api.formitable.com/api/v1.2/${UID}/booking/${today}/14`;

console.log(`Fetching from: ${url}`);

const options = {
    headers: {
        'ApiKey': API_KEY,
        'Accept': 'application/json'
    }
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const bookings = JSON.parse(data);
            console.log(`Total bookings: ${bookings.length}`);
            if (bookings.length > 0) {
                const b = bookings[0];
                console.log('--- Specific Fields ---');
                console.log('ALL KEYS:', JSON.stringify(Object.keys(b), null, 2));
                console.log('Name:', b.name);
                console.log('Email:', b.email);
                console.log('Telephone:', b.telephone);
                console.log('Guest Name:', b.guest ? b.guest.name : 'N/A');
                console.log('Booking Date:', b.bookingDateTime);
                console.log('Party Size:', b.partySize);
                console.log('Pax:', b.pax);
                console.log('Size:', b.size);
                console.log('Quantity:', b.quantity);
                console.log('Guests:', b.guests);
                console.log('People:', b.people);
                console.log('NumberOfGuests:', b.numberOfGuests);
                console.log('Tables:', b.tables);
                if (b.tables && b.tables.length > 0) {
                    console.log('First Table:', JSON.stringify(b.tables[0], null, 2));
                }
            } else {
                console.log('No bookings found to inspect.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data preview:', data.substring(0, 200));
        }
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});
