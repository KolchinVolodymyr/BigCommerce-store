import React from 'react'

export default function ProductTotal(props) {
    return (
        <div className="total">
            Total: {props.context}USD
        </div>
    )
}