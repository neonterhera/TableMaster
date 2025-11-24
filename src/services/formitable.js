const API_KEY = import.meta.env.VITE_FORMITABLE_API_KEY;
const RESTAURANT_UID = import.meta.env.VITE_FORMITABLE_RESTAURANT_UID;

// Use proxy in production to avoid CORS issues
// Hardcoded for debugging
const BASE_URL = '/api/formitable';

// Mock data for development or fallback
const MOCK_BOOKINGS = [
    {
        uid: 'mock-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        telephone: '+31612345678',
        numberOfPeople: 2,
        bookingDateTime: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
        bookingDuration: 120,
        status: 'confirmed',
        tables: [{ id: 1, name: 'T1', minPeople: 2, maxPeople: 4 }]
    },
    {
        uid: 'mock-2',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        telephone: '+31687654321',
        numberOfPeople: 4,
        bookingDateTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
        bookingDuration: 120,
        status: 'confirmed',
        tables: [{ id: 2, name: 'T2', minPeople: 4, maxPeople: 6 }]
    },
    {
        uid: 'mock-3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        telephone: '+31611223344',
        numberOfPeople: 8,
        bookingDateTime: new Date(new Date().setHours(20, 15, 0, 0)).toISOString(),
        bookingDuration: 120,
        status: 'confirmed',
        tables: [{ id: 3, name: 'T3', minPeople: 6, maxPeople: 10 }]
    }
];

export const fetchBookings = async () => {
    // If no keys are present, return empty array
    console.log('Formitable Service: Using BASE_URL:', BASE_URL);
    if (!API_KEY || !RESTAURANT_UID) {
        console.warn('Formitable: Missing API keys.');
        return { data: [], source: 'none', error: 'Missing API Keys' };
    }

    try {
        // Calculate today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const days = 14; // Fetch next 14 days

        const url = `${BASE_URL}/${RESTAURANT_UID}/booking/${today}/${days}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Formitable API Error: ${response.status} ${response.statusText}`);
            // Return empty array on error
            return { data: [], source: 'error', error: `API Error: ${response.status}` };
        }

        const data = await response.json();
        return { data: data || [], source: 'real', error: null };
    } catch (error) {
        console.error('Formitable: Network error', error);
        return { data: [], source: 'error', error: error.message };
    }
};

export const fetchRestaurant = async () => {
    if (!API_KEY) return null;
    try {
        const response = await fetch(`${BASE_URL}/restaurants/${RESTAURANT_UID}`, {
            headers: { 'ApiKey': API_KEY, 'Accept': 'application/json' }
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.error('Failed to fetch restaurant', e);
    }
    return null;
};
