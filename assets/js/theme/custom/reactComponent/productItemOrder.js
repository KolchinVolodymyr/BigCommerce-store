import React from 'react'

export default function ProductItem(props) {
    return (
        <div className="containerCustom">
            {props.context.site.products.map(el => {
                return (
                    <div key={el.id} className="item">
                        <h2 className="item-title-product">{el.name}</h2>
                        <img src={el.defaultImage.url} alt=""/>
                        <div className="description">
                            {el.description.replace(/<[^>]+>/g, '')}
                        </div>
                        <input id={el.entityId} name="country" type="text"></input>
                    </div>
                )
            })}
        </div>
    )
}