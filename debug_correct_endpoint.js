const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com';

async function testCorrectEndpoint() {
    console.log('=== Testing Correct Endpoint Format ===\n');

    const tests = [
        {
            name: 'Correct format: /api/v1.2/{uid}/booking/',
            url: `${BASE_URL}/api/v1.2/${SHORT_UID}/booking/`
        },
        {
            name: 'Without trailing slash',
            url: `${BASE_URL}/api/v1.2/${SHORT_UID}/booking`
        },
        {
            name: 'Plural: bookings',
            url: `${BASE_URL}/api/v1.2/${SHORT_UID}/bookings/`
        }
    ];

    for (const test of tests) {
        console.log(`\nTest: ${test.name}`);
        console.log(`URL: ${test.url}`);

        try {
            const res = await fetch(test.url, {
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json'
                }
            });

            console.log(`Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                const data = await res.json();
                console.log('✅ SUCCESS!');
                console.log(`Response type: ${Array.isArray(data) ? 'Array' : typeof data}`);
                console.log(`Length: ${Array.isArray(data) ? data.length : 'N/A'}`);
                console.log('Sample:', JSON.stringify(data).substring(0, 300));
            } else {
                const text = await res.text();
                console.log('❌ Error:', text.substring(0, 200));
            }
        } catch (e) {
            console.error('❌ Exception:', e.message);
        }
        console.log('---');
    }
}

testCorrectEndpoint();
