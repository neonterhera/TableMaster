const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';

async function testFutureBookings() {
    console.log('=== Testing Future Bookings Endpoint ===\n');
    console.log('Documentation mentions "Get future bookings" endpoint\n');

    const tests = [
        // Future bookings variations
        {
            name: 'Future bookings (plural)',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings/future`
        },
        {
            name: 'Future booking (singular)',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/future`
        },
        {
            name: 'Nested under restaurant - future',
            url: `https://api.formitable.com/api/v1.2/restaurants/${SHORT_UID}/bookings/future`
        },

        // Try "all" endpoint
        {
            name: 'All bookings',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings/all`
        },
        {
            name: 'List endpoint',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings/list`
        },

        // Try just the base bookings without trailing slash
        {
            name: 'Just /bookings (no slash)',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings`
        },
        {
            name: 'Just /bookings/ (with slash)',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings/`
        },

        // Try with date parameters on base endpoint
        {
            name: 'Bookings with from parameter',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings?from=${new Date().toISOString().split('T')[0]}`
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
                console.log('✅✅✅ SUCCESS! FOUND IT! ✅✅✅');
                const data = await res.json();
                console.log(`Type: ${Array.isArray(data) ? 'Array' : typeof data}`);
                console.log(`Count: ${Array.isArray(data) ? data.length : 'N/A'}`);
                console.log(`Data: ${JSON.stringify(data, null, 2).substring(0, 500)}`);
                console.log('\n\n=== THIS IS THE CORRECT ENDPOINT ===');
                return; // Stop on first success
            } else if (res.status === 405) {
                const allow = res.headers.get('Allow');
                console.log(`Method Not Allowed. Allowed: ${allow || 'not specified'}`);
            } else {
                const text = await res.text();
                if (text) {
                    console.log(`Error: ${text.substring(0, 150)}`);
                }
            }
        } catch (e) {
            console.log(`Exception: ${e.message}`);
        }
    }

    console.log('\n\n=== No success yet. Trying external bookings endpoint ===');
    // The search mentioned an external bookings endpoint
    const externalUrl = `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/external`;
    console.log(`URL: ${externalUrl}`);
    try {
        const res = await fetch(externalUrl, {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (res.ok) {
            const data = await res.json();
            console.log('✅ External endpoint works!');
            console.log(`Data: ${JSON.stringify(data).substring(0, 300)}`);
        }
    } catch (e) {
        console.log(`Exception: ${e.message}`);
    }
}

testFutureBookings();
