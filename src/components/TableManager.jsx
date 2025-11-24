import React, { useState } from 'react';
import { useApp } from '../store';
import TableNode from './TableNode';

export default function TableManager() {
    const { tables, addTable } = useApp();
    const [newName, setNewName] = useState('');
    const [newCapacity, setNewCapacity] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName && newCapacity) {
            addTable(newName, newCapacity);
            setNewName('');
            setNewCapacity('');
        }
    };

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
                        {tables.length}
                    </div>
                </div>
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

                {tables.map(table => (
                    <TableNode key={table.id} table={table} disabled={!isEditMode} />
                ))}
            </div>
        </div>
    );
}
