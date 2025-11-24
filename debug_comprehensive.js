const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';

async function comprehensiveTest() {
    console.log('=== Comprehensive API Endpoint Test ===\n');
    console.log(`Restaurant UID: ${SHORT_UID}`);
    console.log(`API Key: ${API_KEY.substring(0, 10)}...\n`);

    const endpoints = [
        // Working endpoint (for reference)
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/restaurants/${SHORT_UID}`, name: '✓ Restaurant Details (known working)' },

        // Booking variations
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking`, name: 'Booking (singular, no slash)' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/`, name: 'Booking (singular, with slash)' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings`, name: 'Bookings (plural, no slash)' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/bookings/`, name: 'Bookings (plural, with slash)' },

        // Nested under restaurants
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/restaurants/${SHORT_UID}/booking`, name: 'Nested: restaurants/{uid}/booking' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/restaurants/${SHORT_UID}/bookings`, name: 'Nested: restaurants/{uid}/bookings' },

        // Top-level bookings with query param
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/booking?restaurantUid=${SHORT_UID}`, name: 'Top-level: booking?restaurantUid=' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/bookings?restaurantUid=${SHORT_UID}`, name: 'Top-level: bookings?restaurantUid=' },

        // Reservations (alternative naming)
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/reservations`, name: 'Reservations' },
        { method: 'GET', url: `https://api.formitable.com/api/v1.2/restaurants/${SHORT_UID}/reservations`, name: 'Nested: restaurants/{uid}/reservations' },
    ];

    for (const endpoint of endpoints) {
        console.log(`\n${endpoint.name}`);
        console.log(`  ${endpoint.method} ${endpoint.url}`);

        try {
            const res = await fetch(endpoint.url, {
                method: endpoint.method,
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const status = `${res.status} ${res.statusText}`;

            if (res.ok) {
                console.log(`  ✅ ${status}`);
                const data = await res.json();
                const preview = JSON.stringify(data).substring(0, 100);
                console.log(`  Data preview: ${preview}...`);
            } else {
                console.log(`  ❌ ${status}`);
                const text = await res.text();
                if (text && text.length > 0) {
                    console.log(`  Error: ${text.substring(0, 100)}`);
                }
            }
        } catch (e) {
            console.log(`  ❌ Exception: ${e.message}`);
        }
    }

    console.log('\n=== Summary ===');
    console.log('If all booking endpoints return 404, this indicates:');
    console.log('1. The API key may not have "Bookings" read permissions');
    console.log('2. The endpoint path has changed in v1.2');
    console.log('3. Bookings may require a different authentication method');
    console.log('\nRecommendation: Check API key permissions in Formitable dashboard');
}

comprehensiveTest();
