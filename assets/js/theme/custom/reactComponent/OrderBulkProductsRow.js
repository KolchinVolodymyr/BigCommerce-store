import React from 'react';

export default class OrderBulkProductsRow extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
               <div>
                    <div>{this.props.product.name}</div>
                    <img src={this.props.product.defaultImage.url}></img>
                    <div>{this.props.product.plainTextDescription}</div>
                    <div>{this.props.product.prices.price.value} {this.props.product.prices.price.currencyCode}</div>
                    <div className='product-count'>
                         <input
                             type='text'
                             className='qtyField'
                             min='0'
                             pattern='[0-9]*'/>
                    </div>
               </div>
               )

    }
}