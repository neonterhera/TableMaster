const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const RESTAURANT_UID = '91edfa29';
const URL = `https://api.formitable.com/api/v1.2/restaurants`;

async function test() {
    console.log(`Testing: ${URL}`);
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
            if (Array.isArray(data)) {
                console.log('Count:', data.length);
                if (data.length > 0) {
                    console.log('First Item:', JSON.stringify(data[0], null, 2));
                } else {
                    console.log('No bookings found (empty array).');
                }
            } else {
                console.log('Data:', JSON.stringify(data, null, 2));
            }
        } catch (e) {
            console.log('Body (not JSON):', text.substring(0, 500));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
