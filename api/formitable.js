export default async function handler(req, res) {
    const FORMITABLE_API_KEY = process.env.FORMITABLE_API_KEY;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract path from URL
    const urlPath = req.url.replace('/api/formitable/', '');

    if (!urlPath) {
        return res.status(400).json({ error: 'Path required' });
    }

    try {
        const apiUrl = `https://api.formitable.com/api/v1.2/${urlPath}`;
        console.log('Proxying to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'ApiKey': FORMITABLE_API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: `API Error: ${response.status}`
            });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
