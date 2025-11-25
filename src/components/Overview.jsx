import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { fetchBookings } from '../services/formitable';
import { streamGoogleAI, isGoogleAIConfigured } from '../services/googleAI';

export default function Overview() {
    const { tables, floors, isLoading } = useApp();
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // AI Chat state
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const messagesEndRef = useRef(null);

    const aiConfigured = isGoogleAIConfigured();

    // Load bookings
    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoadingBookings(true);
            const data = await fetchBookings();
            setBookings(data || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Calculate statistics
    const totalTables = tables.length;
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const availableTables = tables.filter(t => t.status === 'available').length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const occupancyRate = totalTables > 0 ? ((occupiedTables / totalTables) * 100).toFixed(1) : 0;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isAILoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Start AI response
        setIsAILoading(true);
        let aiResponse = '';

        try {
            // Add empty AI message that will be filled
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            // Build context
            const context = {
                tables,
                floors,
                bookings
            };

            // Stream the response
            await streamGoogleAI(userMessage, context, (chunk) => {
                aiResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: aiResponse
                    };
                    return newMessages;
                });
            });
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: '❌ Sorry, I encountered an error. Please make sure your Google AI API key is configured correctly in the .env file.'
                };
                return newMessages;
            });
        } finally {
            setIsAILoading(false);
        }
    };

    const suggestedQuestions = [
        "What's our current capacity utilization?",
        "Which tables are available right now?",
        "How many reservations do we have today?",
        "Suggest optimal seating for a party of 8"
    ];

    if (isLoading || loadingBookings) {
        return (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Loading overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Statistics Dashboard */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>📊 Restaurant Overview</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{
                        background: 'rgba(var(--primary-rgb), 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(var(--primary-rgb), 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalTables}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Tables</div>
                    </div>

                    <div style={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(76, 175, 80, 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{availableTables}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Available</div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 77, 77, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 77, 77, 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF4D4D' }}>{occupiedTables}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Occupied</div>
                    </div>

                    <div style={{
                        background: 'rgba(var(--accent-rgb), 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(var(--accent-rgb), 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{occupancyRate}%</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Occupancy Rate</div>
                    </div>

                    <div style={{
                        background: 'rgba(33, 150, 243, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(33, 150, 243, 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196F3' }}>{totalCapacity}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Capacity</div>
                    </div>

                    <div style={{
                        background: 'rgba(156, 39, 176, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(156, 39, 176, 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9C27B0' }}>{bookings.length}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Reservations</div>
                    </div>
                </div>
            </div>

            {/* AI Assistant */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                <h2 style={{ marginBottom: '1rem' }}>🤖 AI Assistant</h2>

                {!aiConfigured ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 152, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Google AI Not Configured</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                To use the AI assistant, add your Google AI API key to the .env file.
                            </p>
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ display: 'inline-block' }}
                            >
                                Get Free API Key
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            marginBottom: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            padding: '1rem'
                        }}>
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
                                    <p>Ask me anything about your restaurant operations!</p>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                        {suggestedQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInputMessage(q)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '20px',
                                                    color: 'var(--text-main)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '80%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                background: msg.role === 'user'
                                                    ? 'var(--primary)'
                                                    : 'rgba(255,255,255,0.05)',
                                                color: msg.role === 'user' ? '#fff' : 'var(--text-main)'
                                            }}
                                        >
                                            {msg.content || '...'}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask about tables, capacity, reservations..."
                                disabled={isAILoading}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isAILoading || !inputMessage.trim()}
                            >
                                {isAILoading ? '...' : 'Send'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
