// Using built-in fetch in Node.js

// Hardcoded for testing script
const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const RESTAURANT_UID = '91edfa29';

const BASE_URL_V1 = 'https://api.formitable.com/api/v1';
const BASE_URL_V1_2 = 'https://api.formitable.com/api/v1.2';

async function testEndpoint(name, url) {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`URL: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Response Preview: ${text.substring(0, 200)}...`);

        if (response.ok) {
            console.log('✅ SUCCESS');
        } else {
            console.log('❌ FAILED');
        }
    } catch (error) {
        console.error(`❌ ERROR: ${error.message}`);
    }
}

async function runTests() {
    console.log(`Testing with UID: ${RESTAURANT_UID}`);

    // 1. Test Restaurant Details (v1)
    await testEndpoint('Restaurant Details (v1)', `${BASE_URL_V1}/restaurants/${RESTAURANT_UID}`);

    // 2. Test Restaurant Details (v1.2)
    await testEndpoint('Restaurant Details (v1.2)', `${BASE_URL_V1_2}/restaurants/${RESTAURANT_UID}`);

    // 3. Test Bookings (v1)
    await testEndpoint('Bookings (v1)', `${BASE_URL_V1}/bookings?restaurantUid=${RESTAURANT_UID}`);

    // 4. Test Bookings (v1.2)
    await testEndpoint('Bookings (v1.2)', `${BASE_URL_V1_2}/bookings?restaurantUid=${RESTAURANT_UID}`);
    // 5. Test List Restaurants (to find correct UID)
    await testEndpoint('List Restaurants (v1)', `${BASE_URL_V1}/restaurants`);
}

runTests();
