import React from 'react'

export default function ProductTotal({total, currencyCode}) {
    return (
        <div className="total">
           Total: {total} {currencyCode}
        </div>
    )
}