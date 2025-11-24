const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';

async function testMethods() {
    console.log('=== Testing HTTP Methods on Booking Endpoint ===\n');
    console.log('405 Method Not Allowed suggests endpoint exists but GET is wrong method\n');

    const url = `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking`;
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'];

    for (const method of methods) {
        console.log(`\nTrying ${method} ${url}`);

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log(`  Status: ${res.status} ${res.statusText}`);

            // Check for Allow header (tells us which methods are allowed)
            const allowHeader = res.headers.get('Allow');
            if (allowHeader) {
                console.log(`  ✅ Allowed methods: ${allowHeader}`);
            }

            if (res.ok) {
                console.log('  ✅ SUCCESS!');
                const text = await res.text();
                console.log(`  Response: ${text.substring(0, 200)}`);
            }
        } catch (e) {
            console.log(`  Exception: ${e.message}`);
        }
    }

    // Also check if there's a query endpoint
    console.log('\n\n=== Trying Query/Search Endpoints ===');

    const queryUrls = [
        `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query`,
        `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/search`,
        `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/recent`,
        `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/today`,
        `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/upcoming`
    ];

    for (const url of queryUrls) {
        try {
            const res = await fetch(url, {
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json'
                }
            });

            console.log(`\n${url}`);
            console.log(`  Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                console.log('  ✅ FOUND IT!');
                const data = await res.json();
                console.log('  Data:', JSON.stringify(data).substring(0, 200));
            }
        } catch (e) {
            console.log(`  Exception: ${e.message}`);
        }
    }
}

testMethods();
