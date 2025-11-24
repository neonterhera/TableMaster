// import fetch from 'node-fetch'; // Built-in fetch used

const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

const endpoints = [
    { name: 'Restaurant Details', url: `${BASE_URL}/restaurants/${UID}`, method: 'GET' },
    { name: 'Restaurant List', url: `${BASE_URL}/restaurants`, method: 'GET' },
    { name: 'Bookings (Direct)', url: `${BASE_URL}/bookings?restaurantUid=${UID}`, method: 'GET' },
    { name: 'Bookings (Nested)', url: `${BASE_URL}/restaurants/${UID}/bookings`, method: 'GET' },
    { name: 'Availability', url: `${BASE_URL}/restaurants/${UID}/availability`, method: 'GET' },
    { name: 'Tables', url: `${BASE_URL}/restaurants/${UID}/tables`, method: 'GET' },
    { name: 'Reviews', url: `${BASE_URL}/restaurants/${UID}/reviews`, method: 'GET' },
    { name: 'Vouchers', url: `${BASE_URL}/restaurants/${UID}/vouchers`, method: 'GET' }
];

async function checkPermissions() {
    console.log('=== Formitable API Permission Check ===');
    console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
    console.log(`Restaurant UID: ${UID}`);
    console.log('----------------------------------------');

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint.url, {
                method: endpoint.method,
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json'
                }
            });

            const statusIcon = res.ok ? '✅' : '❌';
            console.log(`${statusIcon} ${endpoint.name}: ${res.status} ${res.statusText}`);

            if (!res.ok && res.status === 403) {
                console.log('   -> Permission Denied (403). Key lacks scope for this resource.');
            } else if (!res.ok && res.status === 404) {
                console.log('   -> Not Found (404). Endpoint might be wrong or resource hidden.');
            }
        } catch (error) {
            console.log(`⚠️ ${endpoint.name}: Network Error - ${error.message}`);
        }
    }
    console.log('----------------------------------------');
    console.log('Summary: If "Restaurant Details" works but "Bookings" fails,');
    console.log('your API key likely needs the "Bookings" permission enabled');
    console.log('in the Formitable Dashboard.');
}

checkPermissions();
