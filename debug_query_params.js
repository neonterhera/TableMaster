const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';

async function testQueryWithParams() {
    console.log('=== Testing Query Endpoints with Parameters ===\n');
    console.log('400 Bad Request means endpoint exists but needs parameters\n');

    // Get date range
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7); // Next week

    const fromDate = today.toISOString().split('T')[0];
    const toDate = tomorrow.toISOString().split('T')[0];
    const fromDateTime = today.toISOString();
    const toDateTime = tomorrow.toISOString();

    console.log(`Date range: ${fromDate} to ${toDate}\n`);

    const tests = [
        // Query endpoint with dates
        {
            name: 'booking/query with from/to dates',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query?from=${fromDate}&to=${toDate}`
        },
        {
            name: 'booking/query with datetime',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query?from=${fromDateTime}&to=${toDateTime}`
        },
        {
            name: 'booking/search with dates',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/search?from=${fromDate}&to=${toDate}`
        },
        {
            name: 'booking/recent with limit',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/recent?limit=10`
        },
        {
            name: 'booking/recent with count',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/recent?count=10`
        },
        {
            name: 'booking/today (no params)',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/today`
        },

        // Try POST to query (some APIs use POST for complex queries)
        {
            name: 'POST to booking/query',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query`,
            method: 'POST',
            body: { from: fromDate, to: toDate }
        },

        // Try different parameter names
        {
            name: 'booking/query with startDate/endDate',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query?startDate=${fromDate}&endDate=${toDate}`
        },
        {
            name: 'booking/query with date parameter',
            url: `https://api.formitable.com/api/v1.2/${SHORT_UID}/booking/query?date=${fromDate}`
        }
    ];

    for (const test of tests) {
        console.log(`\nTest: ${test.name}`);
        console.log(`URL: ${test.url}`);

        try {
            const options = {
                method: test.method || 'GET',
                headers: {
                    'ApiKey': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (test.body) {
                options.body = JSON.stringify(test.body);
                console.log(`Body: ${JSON.stringify(test.body)}`);
            }

            const res = await fetch(test.url, options);

            console.log(`Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                console.log('✅ SUCCESS!');
                const data = await res.json();
                console.log(`Type: ${Array.isArray(data) ? 'Array' : typeof data}`);
                console.log(`Count: ${Array.isArray(data) ? data.length : 'N/A'}`);
                console.log(`Sample: ${JSON.stringify(data).substring(0, 300)}`);
            } else if (res.status === 400) {
                const text = await res.text();
                console.log(`Bad Request - might show what's missing: ${text.substring(0, 200)}`);
            } else {
                const text = await res.text();
                console.log(`Error: ${text.substring(0, 100)}`);
            }
        } catch (e) {
            console.log(`Exception: ${e.message}`);
        }
    }
}

testQueryWithParams();
