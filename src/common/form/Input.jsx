import React from 'react'

export default props => (
    <input
        className={props.className}
        name={props.name}
        readOnly={props.readOnly}
        type={props.type} 
        value={props.value}
        checked={props.checked}
        onBlur={props.onBlur}
        onChange={props.onChange} />
)