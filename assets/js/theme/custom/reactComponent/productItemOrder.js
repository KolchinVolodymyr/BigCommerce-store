import React from 'react'

export default function ProductItem({data, onChange}) {
    return (
        <div className="containerCustom">
            {data.site.products.map(el => {
                return (
                    <div key={el.id} className="item">
                        <h2 className="item-title-product">{el.name}</h2>
                        <img src={el.defaultImage.url} alt=""/>
                        <div className="description">
                            {el.description.replace(/<[^>]+>/g, '')}
                        </div>
                        <input
                            id={el.entityId}
                            name="country"
                            type="text"
                         //   value={value}
                            error="Email address must contain a domain name."
                            onChange={onChange}/>
                    </div>
                )
            })}
        </div>
    )
}