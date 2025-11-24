const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function debugLabels() {
    console.log('=== Debugging Labels ===\n');

    const today = new Date();
    const fromDate = today.toISOString().split('T')[0];

    // Fetch bookings for today
    const url = `${BASE_URL}/restaurants/${SHORT_UID}/bookings?from=${fromDate}`;

    try {
        const res = await fetch(url, {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`Found ${data.length} bookings`);

            // Inspect the first 5 bookings for label-related fields
            data.slice(0, 5).forEach((b, i) => {
                console.log(`\nBooking ${i + 1}:`);
                console.log('Color:', b.color);
                console.log('Label:', b.label);
                console.log('Tags:', b.tags);
                console.log('Type:', b.type);
                console.log('Full Object Keys:', Object.keys(b).join(', '));
            });
        } else {
            console.log('Error:', await res.text());
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

debugLabels();
