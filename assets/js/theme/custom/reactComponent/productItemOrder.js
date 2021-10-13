import React from 'react'

export default function ProductItem({data, onChange}) {
    return (
        <div className="containerCustom">
            <div className="loadingOverlay"></div>
            {data.site.products.map(el => {
                return (
                    <div key={el.id} className="item">
                        <div className="item-col-1">
                            <h2 className="item-title-product">{el.name}</h2>
                            <img src={el.defaultImage.url} alt=""/>
                        </div>
                        <div className="item-col-2">
                            <div className="description">
                                {el.description.replace(/<[^>]+>/g, '')}
                            </div>
                        </div>
                        <div className="item-col-3">
                            <input
                                id={el.entityId}
                                className="form-input form-input-order"
                                name="country"
                                type="text"
                                onChange={onChange}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}