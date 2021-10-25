import React from 'react'

export default function ProductItem({data, onChange, checkParams}) {
    return (
        <div className="containerCustom">
            {data.site.products.map(el => {
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
                            <div className="productOption">
                                {el.productOptions.map((i, indexOptions)=> {
                                    return (
                                        <div key={indexOptions}>
                                        <div>{i.displayName}</div>
                                            <select id={i.entityId} className="form-select form-select--small">
                                            {i.values.map((a, indexLabel)=>{
                                                return (
                                                        <option value={a.entityId} key={indexLabel} >{a.label}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    )
                                })
                                }
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