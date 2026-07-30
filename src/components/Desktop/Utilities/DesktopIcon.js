import React, { useRef } from 'react'
import Draggable from 'react-draggable'

const CELL_WIDTH = 96;
const CELL_HEIGHT = 108;

function DesktopIcon({ app, isSelected, onSelect, onOpen, position, onMove, onContextMenu }) {
    const { iconPath, tag, title } = app;
    const nodeRef = useRef(null);
    const movedRef = useRef(false);

    const handleClick = (e) => {
        e.stopPropagation();
        if (movedRef.current) {
            // Suppress the click that follows a drag so it doesn't re-toggle selection.
            movedRef.current = false;
            return;
        }
        onSelect(tag);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        onOpen(app);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(tag);
        onContextMenu(app, e);
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            grid={[CELL_WIDTH, CELL_HEIGHT]}
            defaultPosition={{ x: position.x, y: position.y }}
            onStart={() => {
                movedRef.current = false;
            }}
            onDrag={() => {
                movedRef.current = true;
            }}
            onStop={(e, data) => {
                if (movedRef.current) onMove(tag, data.x, data.y);
            }}
        >
            <div
                ref={nodeRef}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleContextMenu}
                className={isSelected ? 'desktopIconDiv desktopIconSelected' : 'desktopIconDiv'}
            >
                <img src={iconPath} className='desktopIconImage' alt={title} draggable={false} />
                <h3>{title}</h3>
            </div>
        </Draggable>
    )
}

export { CELL_WIDTH, CELL_HEIGHT };
export default DesktopIcon
