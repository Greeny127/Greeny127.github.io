import React from 'react'

function DesktopIcon({iconPath, tag, title, content, windowListHandler, icon}) {
    const hasClickedHandler = () => {
        // Always open a new window with a unique tag
        const uniqueTag = `${tag}_${Date.now()}`;
        windowListHandler("add", uniqueTag, title, content, icon);
    };

    return (
    <div onDoubleClick={() => {
        hasClickedHandler();
      }} className='desktopIconDiv'> 
        <img src={iconPath} className='desktopIconImage'/>
        <h3>{title}</h3>
    </div>
    )
}

export default DesktopIcon