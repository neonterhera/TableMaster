const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const SHORT_UID = '91edfa29';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function getDetails() {
    const url = `${BASE_URL}/restaurants/${SHORT_UID}`;
    console.log(`Fetching: ${url}`);
    try {
        const res = await fetch(url, {
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            const fs = require('fs');
            fs.writeFileSync('details_dump.json', JSON.stringify(data, null, 2));
            console.log('Saved to details_dump.json');
        } else {
            console.log('Error:', await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

getDetails();
