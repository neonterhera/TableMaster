import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Theme State
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // Table State
    const [tables, setTables] = useState(() => {
        const saved = localStorage.getItem('tables');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Window Seat', capacity: 2, status: 'available', x: 50, y: 50 },
            { id: 2, name: 'Booth 1', capacity: 4, status: 'occupied', x: 200, y: 50 },
            { id: 3, name: 'Family Table', capacity: 6, status: 'available', x: 50, y: 200 },
        ];
    });

    // Persist Theme
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Persist Tables
    useEffect(() => {
        localStorage.setItem('tables', JSON.stringify(tables));
    }, [tables]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const addTable = (name, capacity) => {
        const newTable = {
            id: Date.now(),
            name,
            capacity: parseInt(capacity),
            status: 'available',
            x: 100, // Default spawn position
            y: 100
        };
        setTables([...tables, newTable]);
    };

    const removeTable = (id) => {
        setTables(tables.filter(t => t.id !== id));
    };

    const toggleTableStatus = (id) => {
        setTables(tables.map(t =>
            t.id === id
                ? { ...t, status: t.status === 'available' ? 'occupied' : 'available' }
                : t
        ));
    };

    const updateTableStatus = (id, status) => {
        setTables(tables.map(t => t.id === id ? { ...t, status } : t));
    };

    const updateTablePosition = (id, x, y) => {
        setTables(tables.map(t =>
            t.id === id ? { ...t, x, y } : t
        ));
    };

    const updateTableName = (id, newName) => {
        setTables(tables.map(t =>
            t.id === id ? { ...t, name: newName } : t
        ));
    };

    return (
        <AppContext.Provider value={{
            tables,
            addTable,
            removeTable,
            toggleTableStatus,
            updateTableStatus,
            updateTablePosition,
            updateTableName,
            theme,
            toggleTheme
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
