import React from 'react';

export default function BrandItem(props) {
    return (
        <ul className="navPage-subMenu-item">
            {props.arrLetter.map(el => {
                let urlBrand = `/brands/?starting-${el.toLowerCase()}`
                return (
                    <li className="subMenu-item" key={el}>
                        <a href={urlBrand}>{el}</a>
                    </li>
                )
            })}
        </ul>
    )
}