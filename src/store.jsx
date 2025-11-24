import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Theme State
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // Floor State
    const [floors, setFloors] = useState(() => {
        const saved = localStorage.getItem('floors');
        return saved ? JSON.parse(saved) : [
            { id: 'main', name: 'Main Floor' }
        ];
    });

    // Table State
    const [tables, setTables] = useState(() => {
        const saved = localStorage.getItem('tables');
        let initialTables = [];
        if (saved) {
            initialTables = JSON.parse(saved);
            // Migration: Assign existing tables to 'main' floor if missing floorId
            const needsMigration = initialTables.some(t => !t.floorId);
            if (needsMigration) {
                initialTables = initialTables.map(t => ({
                    ...t,
                    floorId: t.floorId || 'main'
                }));
            }
        } else {
            initialTables = [
                { id: 1, name: 'Window Seat', capacity: 2, status: 'available', x: 50, y: 50, floorId: 'main' },
                { id: 2, name: 'Booth 1', capacity: 4, status: 'occupied', x: 200, y: 50, floorId: 'main' },
                { id: 3, name: 'Family Table', capacity: 6, status: 'available', x: 50, y: 200, floorId: 'main' },
            ];
        }
        return initialTables;
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

    // Persist Floors
    useEffect(() => {
        localStorage.setItem('floors', JSON.stringify(floors));
    }, [floors]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Floor Actions
    const addFloor = (name) => {
        const newFloor = {
            id: Date.now().toString(),
            name
        };
        setFloors([...floors, newFloor]);
        return newFloor.id;
    };

    const removeFloor = (id) => {
        // Prevent removing the last floor
        if (floors.length <= 1) return;
        setFloors(floors.filter(f => f.id !== id));
        // Remove tables on this floor
        setTables(tables.filter(t => t.floorId !== id));
    };

    const updateFloorName = (id, name) => {
        setFloors(floors.map(f => f.id === id ? { ...f, name } : f));
    };

    const addTable = (name, capacity, floorId) => {
        const newTable = {
            id: Date.now(),
            name,
            capacity: parseInt(capacity),
            status: 'available',
            x: 100, // Default spawn position
            y: 100,
            floorId
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
            floors,
            addTable,
            removeTable,
            toggleTableStatus,
            updateTableStatus,
            updateTablePosition,
            updateTableName,
            addFloor,
            removeFloor,
            updateFloorName,
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
