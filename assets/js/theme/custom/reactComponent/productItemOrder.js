import React from 'react'

export default function ProductItem({data, onChange}) {
    return (
        <div className="containerCustom">
            {data.map(el => {
                return (
                    <div key={el.id} className="item">
                        <div className="item-col-1">
                            <h2 className="item-title-product">{el.name}</h2>
                            <img src={el.defaultImage.url} alt=""/>
                            <div className="description">
                                {el.description.replace(/<[^>]+>/g, '').substr(0, 240)}
                            </div>
                        </div>
                        <div className="item-col-2">
                            <div className="price">
                                {el.prices.price.value} {el.prices.price.currencyCode}
                            </div>
                        </div>
                        <div className="item-col-3">
                            <div className="blockInput">
                                <input
                                    id={el.entityId}
                                    className="form-input form-input-order"
                                    name="country"
                                    type="text"
                                    onChange={onChange}
                                    placeholder="0"
                                    data-product-stock={el.inventory.aggregated?.availableToSell}
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}