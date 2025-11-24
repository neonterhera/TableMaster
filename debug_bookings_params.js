const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function test() {
    console.log('--- Testing Bookings with Date Params ---');

    // Get today and tomorrow dates
    const today = new Date().toISOString();
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString();

    const url = `${BASE_URL}/restaurants/${UID}/tables`;
    console.log(`URL: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });
        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log('Body:', text.substring(0, 500));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
