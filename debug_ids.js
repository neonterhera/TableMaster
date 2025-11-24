const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const BASE_URL_V1 = 'https://api.formitable.com/api/v1';
const BASE_URL_V1_2 = 'https://api.formitable.com/api/v1.2';

async function test() {
    console.log('--- Step 1: Get Restaurant IDs ---');
    let uid = '91edfa29'; // Default fallback
    try {
        const response = await fetch(`${BASE_URL_V1_2}/restaurants`, {
            headers: { 'ApiKey': API_KEY, 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            const r = data[0];
            console.log('All Keys:', Object.keys(r).join(', '));
            console.log('Full Object:', JSON.stringify(r, null, 2));
            uid = r.uid || uid;
        } else {
            console.log('No restaurants found.');
        }
    } catch (e) {
        console.error('Error fetching restaurants:', e.message);
    }

    console.log(`\n--- Step 2: Test Bookings with UID: ${uid} ---`);

    // Test with extra headers
    try {
        const url = `${BASE_URL_V1_2}/bookings?restaurantUid=${uid}`;
        console.log(`Testing v1.2 with Content-Type: ${url}`);
        const res = await fetch(url, {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log('Body:', text.substring(0, 200));
    } catch (e) { console.error('Error:', e.message); }
}

test();
