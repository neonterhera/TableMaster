import fs from 'fs';
const API_KEY = 'YnRPgCw9dl1wTQgHzYuiStQ8/+LzUPN4/Ju1V/Ih+TM=';
const BASE_URL = 'https://api.formitable.com/api/v1.2';

async function dumpRestaurantData() {
    console.log('Fetching restaurant data...');
    try {
        const response = await fetch(`${BASE_URL}/restaurants`, {
            headers: { 'ApiKey': API_KEY, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log(`Fetched ${data.length} restaurants.`);

        if (data.length > 0) {
            const filePath = './restaurant_dump.json';
            fs.writeFileSync(filePath, JSON.stringify(data[0], null, 2));
            console.log(`Full restaurant object written to ${filePath}`);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

dumpRestaurantData();
