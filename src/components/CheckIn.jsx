import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { fetchBookings } from '../services/formitable';

// Helper for Dutch date formatting
const getDutchDateString = (date) => {
    return date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
};

const getDayName = (date) => {
    return date.toLocaleDateString('nl-NL', { weekday: 'short' });
};

const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
};

export default function CheckIn() {
    const { tables, updateTableStatus } = useApp();
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [bookingsSource, setBookingsSource] = useState('real');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [showCanceled, setShowCanceled] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');

    // Modal State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showTableModal, setShowTableModal] = useState(false);

    // Derived labels from bookings (tickets)
    const availableLabels = [...new Set(bookings.flatMap(b => b.tickets?.map(t => t.title) || []))].filter(Boolean).sort();

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoadingBookings(true);
        const { data: fetchedBookings, source } = await fetchBookings();
        setBookings(fetchedBookings || []);
        setBookingsSource(source);
        setLoadingBookings(false);
    };

    // Date Navigation
    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const getUpcomingDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(d);
        }
        return days;
    };

    // Filtering Logic
    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.bookingDateTime);
        if (!isSameDay(bookingDate, selectedDate)) return false;
        if (!showCanceled && b.status === 'CANCELLED') return false;
        if (selectedLabel) {
            const hasLabel = b.tickets?.some(t => t.title === selectedLabel);
            if (!hasLabel) return false;
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const fullName = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
            const size = b.numberOfPeople?.toString();
            return fullName.includes(query) || size === query;
        }
        return true;
    });

    // Table Selection Logic
    const handleCheckInClick = (booking) => {
        setSelectedBooking(booking);
        setShowTableModal(true);
    };

    const handleAssignTable = (tableId) => {
        updateTableStatus(tableId, 'occupied');
        setShowTableModal(false);
        setSelectedBooking(null);
    };

    const getAvailableTables = () => {
        if (!selectedBooking) return [];
        const size = selectedBooking.numberOfPeople;
        return tables
            .filter(t => t.status === 'available' && t.capacity >= size)
            .sort((a, b) => a.capacity - b.capacity);
    };

    return (
        <div className="checkin-container" style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Main Card */}
            <div style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--bg-card-border)',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}>
                {/* Header Section */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bg-card-border)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Reservations</h2>
                        <button onClick={loadBookings} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }} title="Refresh">↻</button>
                    </div>

                    {/* Search Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Search name or size..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--bg-card-border)',
                                background: 'rgba(255,255,255,0.03)',
                                color: 'var(--text-main)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex items-center" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
                        <select
                            value={selectedLabel}
                            onChange={(e) => setSelectedLabel(e.target.value)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--bg-card-border)',
                                background: 'rgba(255,255,255,0.03)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                maxWidth: '120px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                        >
                            <option value="">All Labels</option>
                            {availableLabels.map(label => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>

                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)',
                            padding: '0.4rem 0.6rem', borderRadius: '8px',
                            background: showCanceled ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'background 0.2s'
                        }}>
                            <input
                                type="checkbox"
                                checked={showCanceled}
                                onChange={(e) => setShowCanceled(e.target.checked)}
                                style={{ margin: 0 }}
                            />
                            <span>Canceled</span>
                        </label>
                    </div>

                    {/* Centered Date Nav */}
                    <div className="flex justify-center items-center" style={{ marginBottom: '0.5rem' }}>
                        <div className="flex items-center" style={{ gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px', width: '100%', justifyContent: 'space-between' }}>
                            <button onClick={handlePrevDay} className="btn-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>‹</button>
                            <span style={{ fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', flex: 1 }}>
                                {getDutchDateString(selectedDate)}
                            </span>
                            <button onClick={handleNextDay} className="btn-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>›</button>
                        </div>
                    </div>
                </div>

                {/* Reservation List */}
                <div style={{
                    height: '600px', // Fixed height for consistency
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.1)',
                    position: 'relative'
                }} className="hide-scrollbar">
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>

                    {loadingBookings ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                            {bookings.length === 0 ? "No bookings for this date" : "No matches found"}
                        </div>
                    ) : (
                        <div style={{ padding: '0.5rem' }}>
                            {filteredBookings.map(booking => {
                                const isCanceled = booking.status === 'CANCELLED';
                                return (
                                    <div key={booking.uid || booking.id} style={{
                                        padding: '0.75rem 1rem',
                                        marginBottom: '0.5rem',
                                        background: 'var(--bg-card)',
                                        borderRadius: '12px',
                                        border: '1px solid transparent',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        opacity: isCanceled ? 0.6 : 1,
                                        transition: 'transform 0.1s, background 0.1s',
                                        cursor: 'default'
                                    }}
                                    >
                                        <div className="flex items-center" style={{ gap: '1rem' }}>
                                            {/* Time */}
                                            <div style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                minWidth: '45px', paddingRight: '0.75rem',
                                                borderRight: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)' }}>
                                                    {new Date(booking.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isCanceled && <span style={{ fontSize: '0.6rem', color: 'var(--danger)', fontWeight: '700', textTransform: 'uppercase' }}>Canceled</span>}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                                    <span style={{
                                                        fontWeight: '500', fontSize: '1rem', color: 'var(--text-main)',
                                                        textDecoration: isCanceled ? 'line-through' : 'none'
                                                    }}>
                                                        {`${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Unknown'}
                                                    </span>
                                                    {booking.tickets?.map((ticket, i) => {
                                                        // Smart abbreviation logic
                                                        let abbrev = '';
                                                        const title = ticket.title || '';

                                                        // Get first letter of each word (e.g., "Finch deal" -> "FD")
                                                        const words = title.split(' ').filter(w => w.length > 0);
                                                        abbrev = words.map(w => w[0].toUpperCase()).join('');

                                                        // If abbreviation is too long, take first 2 letters
                                                        if (abbrev.length > 2) {
                                                            abbrev = abbrev.substring(0, 2);
                                                        }

                                                        // Extract course number (e.g., "3 gangen" -> "3", "4 gangen" -> "4")
                                                        const courseMatch = title.match(/(\d+)\s*gangen/i);
                                                        if (courseMatch) {
                                                            abbrev += courseMatch[1];
                                                        }

                                                        // Fallback if no abbreviation
                                                        if (!abbrev) abbrev = 'T';

                                                        return (
                                                            <div key={i} style={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: '700',
                                                                padding: '0.15rem 0.35rem',
                                                                borderRadius: '4px',
                                                                background: booking.color || '#666',
                                                                color: '#fff',
                                                                minWidth: '24px',
                                                                textAlign: 'center',
                                                                letterSpacing: '0.02em'
                                                            }}>
                                                                {abbrev}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                                                    {booking.numberOfPeople} people
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {!isCanceled && (
                                            <button
                                                onClick={() => handleCheckInClick(booking)}
                                                className="btn-primary"
                                                style={{
                                                    padding: '0.4rem 0.6rem',
                                                    fontSize: '0.8rem',
                                                    borderRadius: '8px',
                                                    background: 'var(--primary)',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    width: '80px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Check In
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Selection Modal */}
            {showTableModal && selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#1a1a1a', padding: '1.5rem', borderRadius: '20px',
                        width: '90%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Select Table</h3>
                            <button onClick={() => setShowTableModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Assigning table for <strong>{selectedBooking.firstName}</strong> ({selectedBooking.numberOfPeople} ppl)
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', padding: '0.25rem' }} className="hide-scrollbar">
                            {getAvailableTables().length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
                                    No suitable tables available.
                                </div>
                            ) : (
                                getAvailableTables().map(table => (
                                    <button
                                        key={table.id}
                                        onClick={() => handleAssignTable(table.id)}
                                        style={{
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--success)',
                                            borderRadius: '12px',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(46, 204, 113, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{table.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cap: {table.capacity}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
