const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function testAvailability() {
    console.log(`Testing Availability for UID: ${UID}`);

    const endpoints = [
        `${BASE_URL}/restaurants/${UID}/availability`,
        `${BASE_URL}/availability?restaurantUid=${UID}`,
        `${BASE_URL}/restaurants/${UID}/tables` // Try tables too
    ];

    for (const url of endpoints) {
        try {
            console.log(`\nFetching: ${url}`);
            const res = await fetch(url, {
                headers: { 'ApiKey': API_KEY, 'Accept': 'application/json' }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const text = await res.text();
                console.log('Success! Body Preview:', text.substring(0, 200));
            }
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

testAvailability();
