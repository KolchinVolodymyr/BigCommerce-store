import PageManager from '../page-manager';
import React from 'react'
import ReactDOM from 'react-dom';
import BrandItem from './reactComponent/BrandItem';

export default function () {
    //console.log("brand");
    let arr = [];
    for (let i = 65; i < 91; i++) {
        //console.log('all string', String.fromCharCode(i));
        arr.push(String.fromCharCode(i));
    }
    console.log('arr', arr);
    if(document.getElementById('navPage-subMenu-brand')) {
        ReactDOM.render(<BrandItem arr={arr}/>, document.getElementById('navPage-subMenu-brand'));
        console.log('navPage-subMenu-brand', document.getElementById('navPage-subMenu-brand'));
    }
}