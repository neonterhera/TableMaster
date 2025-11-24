const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function testBookings() {
    console.log('=== Testing Bookings Endpoint ===\n');

    // Get today's date range
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const fromDate = today.toISOString().split('T')[0];
    const toDate = tomorrow.toISOString().split('T')[0];

    const tests = [
        {
            name: 'Bookings with restaurantUid query param',
            url: `${BASE_URL}/bookings?restaurantUid=${SHORT_UID}`
        },
        {
            name: 'Bookings with restaurantUid and date range',
            url: `${BASE_URL}/bookings?restaurantUid=${SHORT_UID}&from=${fromDate}&to=${toDate}`
        },
        {
            name: 'Bookings nested under restaurant',
            url: `${BASE_URL}/restaurants/${SHORT_UID}/bookings`
        },
        {
            name: 'Bookings nested with date range',
            url: `${BASE_URL}/restaurants/${SHORT_UID}/bookings?from=${fromDate}&to=${toDate}`
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
                console.log(`Success! Found ${Array.isArray(data) ? data.length : 'N/A'} bookings`);
                console.log('Sample:', JSON.stringify(data).substring(0, 200));
            } else {
                const text = await res.text();
                console.log('Error:', text.substring(0, 200));
            }
        } catch (e) {
            console.error('Exception:', e.message);
        }
    }
}

testBookings();
