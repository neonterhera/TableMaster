import React, { useState } from 'react';
import { useApp } from '../store';
import TableNode from './TableNode';

export default function TableManager() {
    const { tables, addTable, floors, addFloor, removeFloor, updateFloorName } = useApp();
    const [newName, setNewName] = useState('');
    const [newCapacity, setNewCapacity] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeFloorId, setActiveFloorId] = useState(floors[0]?.id || 'main');

    // Ensure activeFloorId is valid (in case a floor was deleted)
    React.useEffect(() => {
        if (!floors.find(f => f.id === activeFloorId) && floors.length > 0) {
            setActiveFloorId(floors[0].id);
        }
    }, [floors, activeFloorId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName && newCapacity) {
            addTable(newName, newCapacity, activeFloorId);
            setNewName('');
            setNewCapacity('');
        }
    };

    const handleAddFloor = () => {
        const name = prompt("Enter new floor name:");
        if (name) {
            const id = addFloor(name);
            setActiveFloorId(id);
        }
    };

    const handleRemoveFloor = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure? This will delete all tables on this floor.")) {
            removeFloor(id);
        }
    };

    const handleRenameFloor = (id, currentName) => {
        const name = prompt("Rename floor:", currentName);
        if (name) {
            updateFloorName(id, name);
        }
    };

    const activeTables = tables.filter(t => t.floorId === activeFloorId);

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
            <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                <h2>Floor Plan</h2>
                <div className="flex">
                    <button
                        className={isEditMode ? 'btn-primary' : ''}
                        style={{
                            background: isEditMode ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                            color: isEditMode ? '#000' : '#fff',
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.8rem'
                        }}
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        {isEditMode ? 'Done Editing' : 'Edit Layout'}
                    </button>
                    <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                        {activeTables.length} Tables
                    </div>
                </div>
            </div>

            {/* Floor Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
                {floors.map(floor => (
                    <div
                        key={floor.id}
                        onClick={() => setActiveFloorId(floor.id)}
                        onDoubleClick={() => handleRenameFloor(floor.id, floor.name)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '12px',
                            background: activeFloorId === floor.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: activeFloorId === floor.id ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: activeFloorId === floor.id ? 'none' : '1px solid var(--bg-card-border)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{floor.name}</span>
                        {isEditMode && floors.length > 1 && (
                            <button
                                onClick={(e) => handleRemoveFloor(e, floor.id)}
                                style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={handleAddFloor}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px dashed var(--text-secondary)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    + New Floor
                </button>
            </div>

            {isEditMode && (
                <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '2fr 1fr auto', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Table Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Cap"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        min="1"
                    />
                    <button type="submit" className="btn-primary">Add</button>
                </form>
            )}

            <div
                className="floor-plan-container"
                style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: `2px ${isEditMode ? 'dashed var(--accent)' : 'solid var(--border)'}`,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    touchAction: isEditMode ? 'none' : 'auto' // Prevent scrolling while dragging in edit mode
                }}
            >
                <p style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)', pointerEvents: 'none', fontSize: '0.8rem', zIndex: 0 }}>
                    {isEditMode ? 'Drag tables to rearrange' : 'View Mode'}
                </p>

                {activeTables.map(table => (
                    <TableNode key={table.id} table={table} disabled={!isEditMode} />
                ))}
            </div>
        </div>
    );
}
