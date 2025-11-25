import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

let genAI = null;
let model = null;

// Initialize the Google AI client
if (apiKey && apiKey !== 'your_google_ai_api_key_here') {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

/**
 * Send a query to Google AI with restaurant context
 * @param {string} userQuery - The user's question
 * @param {object} context - Restaurant data context (tables, bookings, etc.)
 * @returns {Promise<string>} - AI response
 */
export async function queryGoogleAI(userQuery, context = {}) {
    if (!model) {
        throw new Error('Google AI is not configured. Please add your API key to the .env file.');
    }

    try {
        // Build context string
        const contextString = buildContextString(context);

        // Create the full prompt
        const prompt = `You are a helpful restaurant management assistant for TableMaster. 
You have access to the following restaurant data:

${contextString}

User Question: ${userQuery}

Please provide a helpful, concise response based on the available data. If you need more information to answer accurately, let the user know.`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Google AI Error:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
}

/**
 * Stream a response from Google AI
 * @param {string} userQuery - The user's question
 * @param {object} context - Restaurant data context
 * @param {function} onChunk - Callback for each chunk of text
 * @returns {Promise<void>}
 */
export async function streamGoogleAI(userQuery, context = {}, onChunk) {
    if (!model) {
        throw new Error('Google AI is not configured. Please add your API key to the .env file.');
    }

    try {
        const contextString = buildContextString(context);

        const prompt = `You are a helpful restaurant management assistant for TableMaster. 
You have access to the following restaurant data:

${contextString}

User Question: ${userQuery}

Please provide a helpful, concise response based on the available data. If you need more information to answer accurately, let the user know.`;

        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            onChunk(chunkText);
        }
    } catch (error) {
        console.error('Google AI Stream Error:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
}

/**
 * Build context string from restaurant data
 */
function buildContextString(context) {
    const parts = [];

    // Tables information
    if (context.tables && context.tables.length > 0) {
        const totalCapacity = context.tables.reduce((sum, t) => sum + t.capacity, 0);
        const availableTables = context.tables.filter(t => t.status === 'available');
        const occupiedTables = context.tables.filter(t => t.status === 'occupied');

        parts.push(`TABLES:
- Total tables: ${context.tables.length}
- Total capacity: ${totalCapacity} people
- Available tables: ${availableTables.length}
- Occupied tables: ${occupiedTables.length}
- Table details: ${context.tables.map(t => `${t.name} (${t.capacity} seats, ${t.status})`).join(', ')}`);
    }

    // Floors information
    if (context.floors && context.floors.length > 0) {
        parts.push(`FLOORS:
- Total floors: ${context.floors.length}
- Floor names: ${context.floors.map(f => f.name).join(', ')}`);
    }

    // Bookings information
    if (context.bookings && context.bookings.length > 0) {
        parts.push(`RESERVATIONS:
- Total reservations today: ${context.bookings.length}
- Reservation details: ${context.bookings.slice(0, 10).map(b =>
            `${b.guest_name || 'Guest'} - ${b.party_size} people at ${b.time || 'TBD'}`
        ).join(', ')}`);
    }

    // Current time
    parts.push(`CURRENT TIME: ${new Date().toLocaleString()}`);

    return parts.join('\n\n');
}

/**
 * Check if Google AI is configured
 */
export function isGoogleAIConfigured() {
    return apiKey && apiKey !== 'your_google_ai_api_key_here';
}
