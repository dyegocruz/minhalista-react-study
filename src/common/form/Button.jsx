import React from 'react'

export default props => (
    <button type="button" 
        className={props.className} 
        onClick={props.onClick}>
        {props.children}
    </button>
)