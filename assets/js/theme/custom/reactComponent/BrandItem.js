import React from 'react';

export default function BrandItem(props) {
//    console.log('props', props);
//    console.log('props arr', props.arr);
    return (
        <ul className="navPage-subMenu-item">
            {props.arr.map(el => {
                return (
                    <li className="subMenu-item" key={el}>
                        <a href={el}>{el}</a>
                    </li>
                )
            })}
        </ul>
    )
}