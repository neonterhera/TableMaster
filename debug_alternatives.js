const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';

async function testAlternatives() {
    console.log('=== Testing Alternative Approaches ===\n');
    console.log('Permissions confirmed enabled. Testing other possibilities...\n');

    const tests = [
        // Try older API version
        {
            name: 'v1.0 bookings endpoint',
            url: `https://api.formitable.com/api/v1.0/${SHORT_UID}/booking`
        },
        {
            name: 'v1.1 bookings endpoint',
            url: `https://api.formitable.com/api/v1.1/${SHORT_UID}/booking`
        },

        // Try without /api prefix
        {
            name: 'Without /api prefix',
            url: `https://api.formitable.com/v1.2/${SHORT_UID}/booking`
        },

        // Try with Authorization header instead of ApiKey
        {
            name: 'Using Authorization header',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking`,
            useAuthHeader: true
        },

        // Try Bearer token format
        {
            name: 'Using Bearer token',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking`,
            useBearer: true
        },

        // Check if there's a different endpoint for listing vs getting
        {
            name: 'List endpoint',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/list`
        },

        // Try with .json extension
        {
            name: 'With .json extension',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking.json`
        }
    ];

    for (const test of tests) {
        console.log(`\nTest: ${test.name}`);
        console.log(`URL: ${test.url}`);

        try {
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            if (test.useAuthHeader) {
                headers['Authorization'] = API_KEY;
            } else if (test.useBearer) {
                headers['Authorization'] = `Bearer ${API_KEY}`;
            } else {
                headers['ApiKey'] = API_KEY;
            }

            const res = await fetch(test.url, { headers });

            console.log(`Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                console.log('✅ SUCCESS! This endpoint works!');
                const data = await res.json();
                console.log('Data:', JSON.stringify(data).substring(0, 300));
            } else {
                const text = await res.text();
                console.log(`Error: ${text.substring(0, 100)}`);
            }
        } catch (e) {
            console.log(`Exception: ${e.message}`);
        }
    }

    console.log('\n=== Additional Check: List All Restaurants ===');
    try {
        const res = await fetch('https://api.formitable.com/api/v1.2/restaurants', {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Number of restaurants:', Array.isArray(data) ? data.length : 'N/A');
            if (Array.isArray(data) && data.length > 0) {
                console.log('First restaurant UID:', data[0].uid);
                console.log('Available fields:', Object.keys(data[0]).join(', '));
            }
        }
    } catch (e) {
        console.log('Exception:', e.message);
    }
}

testAlternatives();
