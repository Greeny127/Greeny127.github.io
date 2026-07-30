import React from 'react'

function DesktopArea(props) {
  return (
    <div className='desktopArea' onClick={props.onDeselect} onContextMenu={props.onContextMenu}>{props.children}</div>
  )
}

export default DesktopArea
