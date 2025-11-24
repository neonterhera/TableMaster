import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { useApp } from '../store';

export default function TableNode({ table, disabled }) {
    const { toggleTableStatus, removeTable, updateTablePosition, updateTableName } = useApp();
    const nodeRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(table.name);

    const handleStop = (e, data) => {
        updateTablePosition(table.id, data.x, data.y);
    };

    const handleRename = (e) => {
        e.preventDefault();
        updateTableName(table.id, editName);
        setIsEditing(false);
    };

    // Determine shape and dimensions based on capacity
    const getTableStyle = () => {
        let width = 80;
        let height = 80;
        let borderRadius = '50%'; // Default round

        if (table.capacity > 4) {
            width = 120;
            height = 80;
            borderRadius = '12px'; // Rectangular for larger groups
        }
        if (table.capacity > 8) {
            width = 160;
            height = 90;
        }

        return {
            width: `${width}px`,
            height: `${height}px`,
            borderRadius,
        };
    };

    // Generate "chairs" visual
    const renderChairs = () => {
        const chairs = [];
        const total = table.capacity;
        const { width, height } = getTableStyle();
        const w = parseInt(width);
        const h = parseInt(height);

        // Simple distribution logic
        for (let i = 0; i < total; i++) {
            const angle = (i / total) * 2 * Math.PI;
            // Position chairs around the center
            const radius = Math.max(w, h) / 1.5 + 10;
            const left = 50 + Math.cos(angle) * 50; // %
            const top = 50 + Math.sin(angle) * 50; // %

            // Adjust for rectangular shapes roughly
            let x = Math.cos(angle) * (w / 2 + 15);
            let y = Math.sin(angle) * (h / 2 + 15);

            chairs.push(
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        background: table.status === 'available' ? 'rgba(255,255,255,0.3)' : 'rgba(255, 77, 77, 0.3)',
                        borderRadius: '50%',
                        transform: `translate(${x}px, ${y}px)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-6px',
                        marginTop: '-6px',
                    }}
                />
            );
        }
        return chairs;
    };

    return (
        <Draggable
            defaultPosition={{ x: table.x || 0, y: table.y || 0 }}
            position={{ x: table.x || 0, y: table.y || 0 }}
            onStop={handleStop}
            bounds="parent"
            nodeRef={nodeRef}
            disabled={disabled}
        >
            <div
                ref={nodeRef}
                style={{
                    position: 'absolute',
                    cursor: 'move',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Chairs Container */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {renderChairs()}
                </div>

                {/* Table Top */}
                <div style={{
                    ...getTableStyle(),
                    background: table.status === 'available' ? 'var(--card-bg)' : 'rgba(255, 77, 77, 0.1)',
                    border: `2px solid ${table.status === 'available' ? 'var(--accent)' : 'var(--danger)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}>

                    {isEditing ? (
                        <form onSubmit={handleRename} style={{ width: '90%' }}>
                            <input
                                autoFocus
                                onFocus={(e) => e.target.select()}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={() => setIsEditing(false)}
                                style={{
                                    padding: '2px',
                                    fontSize: '0.8em',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    color: 'white',
                                    width: '100%'
                                }}
                            />
                        </form>
                    ) : (
                        <>
                            <div
                                style={{ fontWeight: 'bold', fontSize: '0.85em', textAlign: 'center', padding: '0 5px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                title={table.name}
                            >
                                {table.name}
                            </div>
                            <div style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>{table.capacity}</div>
                        </>
                    )}

                    {/* Controls */}
                    <div className="flex" style={{ marginTop: '4px', gap: '4px', opacity: 0.8 }}>
                        <button
                            onClick={() => toggleTableStatus(table.id)}
                            style={{
                                padding: '0',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: table.status === 'available' ? 'var(--success)' : 'var(--danger)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            title="Toggle Status"
                        />
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: '0',
                                background: 'none',
                                color: 'var(--accent)',
                                fontSize: '0.9em',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            title="Rename"
                        >
                            ✎
                        </button>
                        <button
                            onClick={() => removeTable(table.id)}
                            style={{
                                padding: '0',
                                background: 'none',
                                color: 'var(--text-secondary)',
                                fontSize: '1.1em',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            title="Remove"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    );
}
