import React, { createContext, useContext, useState, useEffect } from 'react';
import { floorService, tableService } from './services/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Theme State (keep in localStorage - user preference)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // Loading and Error States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Floor State
    const [floors, setFloors] = useState([]);

    // Table State
    const [tables, setTables] = useState([]);

    // Persist Theme
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Load initial data from Supabase
    useEffect(() => {
        loadInitialData();
    }, []);

    // Subscribe to real-time changes
    useEffect(() => {
        // Subscribe to floor changes
        const unsubscribeFloors = floorService.subscribe((payload) => {
            console.log('Floor change:', payload);

            if (payload.eventType === 'INSERT') {
                setFloors(prev => [...prev, payload.new]);
            } else if (payload.eventType === 'UPDATE') {
                setFloors(prev => prev.map(f =>
                    f.id === payload.new.id ? payload.new : f
                ));
            } else if (payload.eventType === 'DELETE') {
                setFloors(prev => prev.filter(f => f.id !== payload.old.id));
            }
        });

        // Subscribe to table changes
        const unsubscribeTables = tableService.subscribe((payload) => {
            console.log('Table change:', payload);

            if (payload.eventType === 'INSERT') {
                setTables(prev => [...prev, payload.new]);
            } else if (payload.eventType === 'UPDATE') {
                setTables(prev => prev.map(t =>
                    t.id === payload.new.id ? payload.new : t
                ));
            } else if (payload.eventType === 'DELETE') {
                setTables(prev => prev.filter(t => t.id !== payload.old.id));
            }
        });

        return () => {
            unsubscribeFloors();
            unsubscribeTables();
        };
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Load floors and tables in parallel
            const [floorsData, tablesData] = await Promise.all([
                floorService.getAll(),
                tableService.getAll()
            ]);

            setFloors(floorsData);
            setTables(tablesData);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load data from database. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Floor Actions
    const addFloor = async (name) => {
        try {
            const newFloor = await floorService.create(name);
            // Real-time subscription will update the state
            return newFloor.id;
        } catch (err) {
            console.error('Error adding floor:', err);
            setError('Failed to add floor. Please try again.');
            throw err;
        }
    };

    const removeFloor = async (id) => {
        // Prevent removing the last floor
        if (floors.length <= 1) return;

        try {
            await floorService.delete(id);
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error removing floor:', err);
            setError('Failed to remove floor. Please try again.');
            throw err;
        }
    };

    const updateFloorName = async (id, name) => {
        try {
            await floorService.update(id, name);
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error updating floor:', err);
            setError('Failed to update floor. Please try again.');
            throw err;
        }
    };

    // Table Actions
    const addTable = async (name, capacity, floorId) => {
        try {
            const newTable = {
                name,
                capacity: parseInt(capacity),
                status: 'available',
                x: 100,
                y: 100,
                floor_id: floorId
            };

            await tableService.create(newTable);
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error adding table:', err);
            setError('Failed to add table. Please try again.');
            throw err;
        }
    };

    const removeTable = async (id) => {
        try {
            await tableService.delete(id);
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error removing table:', err);
            setError('Failed to remove table. Please try again.');
            throw err;
        }
    };

    const toggleTableStatus = async (id) => {
        try {
            const table = tables.find(t => t.id === id);
            if (!table) return;

            const newStatus = table.status === 'available' ? 'occupied' : 'available';
            await tableService.update(id, { status: newStatus });
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error toggling table status:', err);
            setError('Failed to update table status. Please try again.');
            throw err;
        }
    };

    const updateTableStatus = async (id, status) => {
        try {
            await tableService.update(id, { status });
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error updating table status:', err);
            setError('Failed to update table status. Please try again.');
            throw err;
        }
    };

    const updateTablePosition = async (id, x, y) => {
        try {
            // Optimistic update for smooth drag experience
            setTables(prev => prev.map(t =>
                t.id === id ? { ...t, x, y } : t
            ));

            await tableService.update(id, { x, y });
            // Real-time subscription will sync with other clients
        } catch (err) {
            console.error('Error updating table position:', err);
            // Reload data to revert optimistic update
            loadInitialData();
        }
    };

    const updateTableName = async (id, newName) => {
        try {
            await tableService.update(id, { name: newName });
            // Real-time subscription will update the state
        } catch (err) {
            console.error('Error updating table name:', err);
            setError('Failed to update table name. Please try again.');
            throw err;
        }
    };

    return (
        <AppContext.Provider value={{
            tables,
            floors,
            isLoading,
            error,
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
