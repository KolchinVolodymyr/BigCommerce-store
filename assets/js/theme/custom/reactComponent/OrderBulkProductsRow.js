import React from 'react';
import nod from "nod-validate";

export default class OrderBulkProductsRow extends React.Component {
    constructor(props) {
        super(props);
        this.productVariantPrice = 0;
        this.Nod = nod();
        this.Nod.configure({submit: document.getElementById('productVariants'), disableSubmit: true});
        //this.stock = this.props.variant.inventory?.aggregated.availableToSell;
    }

   handleChange(e) {
        const $input = $(e.target);
        const inputValue =  e.target.value.replace(/[^0-9]/g, "");
        this.setState({ inputValue });

        this.Nod.performCheck();

        this.productVariantPrice = e.target.value.replace(/[^\d]/g,'') * this.props.product.prices.price.value;
        this.props.changeTotal(this.props.product.entityId, this.productVariantPrice);
    }

    render() {
        return (
               <div className='order-bulk-product'>
                    <div className='product-name'>{this.props.product.name}</div>
                    <img src={this.props.product.defaultImage.url}></img>
                    <div className='product-description'>{this.props.product.plainTextDescription}</div>
                    <div className='product-price'>{this.props.product.prices.price.value} {this.props.product.prices.price.currencyCode}</div>
                    <div className='product-count'>
                         <input
                             type='text'
                             className='qtyField'
                             min='0'
                             onChange={this.handleChange.bind(this)}
                             pattern='[0-9]*'/>
                    </div>
               </div>
               )
    }
}