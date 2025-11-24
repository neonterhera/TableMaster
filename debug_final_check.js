const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';
const LONG_UID = '91edfa29-0000-0000-0000-000000000000';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function test() {
    console.log('--- Final Check ---');

    const tests = [
        { name: 'Details (Short)', url: `${BASE_URL}/restaurants/${SHORT_UID}` },
        { name: 'Details (Long)', url: `${BASE_URL}/restaurants/${LONG_UID}` },
        { name: 'Bookings (Short)', url: `${BASE_URL}/bookings?restaurantUid=${SHORT_UID}` },
        { name: 'Bookings (Long)', url: `${BASE_URL}/bookings?restaurantUid=${LONG_UID}` }
    ];

    for (const t of tests) {
        try {
            console.log(`\nTesting ${t.name}: ${t.url}`);
            const res = await fetch(t.url, {
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Status: ${res.status} ${res.statusText}`);
            if (res.ok) {
                const text = await res.text();
                console.log('Body Preview:', text.substring(0, 100));
            } else {
                const text = await res.text();
                console.log('Error Body:', text.substring(0, 200));
            }
        } catch (e) {
            console.error('Exception:', e.message);
        }
    }
}

test();
