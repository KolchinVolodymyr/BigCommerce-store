import React from 'react';
import nod from "nod-validate";

export default class OrderBulkProductsRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
        this.productVariantPrice = 0;
        this.Nod = nod();
        this.Nod.configure({submit: document.getElementById('productVariants'), disableSubmit: true});
        this.stock = this.props.product.inventory?.aggregated?.availableToSell;
    }

    handleChange(e) {
        const $input = $(e.target);
        const inputValue =  e.target.value.replace(/[^0-9]/g, "");
        this.setState({ inputValue });

        if(this.stock !== undefined) {
            this.Nod.add([{
                  selector: $input,
                  validate: `max-number:${this.stock}`,
                  errorMessage: `Available for purchase  ${this.stock}`
              },{
                selector: $input,
                validate: "integer",
                errorMessage: `You must enter numbers.`
              }])
        } else {
            this.Nod.add([{
              selector: $input,
              validate: "integer",
              errorMessage: `You must enter numbers.`
            }])
        }
        this.Nod.performCheck();
        this.productVariantPrice = e.target.value.replace(/[^\d]/g,'') * this.props.product.prices.price.value;
        this.props.changeTotal(this.props.product.entityId, this.productVariantPrice);

        if(this.Nod.areAll('valid')) {
            if($('.form-inlineMessage').length !== 0){
                $('#productVariants')[0].setAttribute("disabled", "");
            } else {
                $('#productVariants')[0].removeAttribute("disabled");
            }
        } else {
            $('#productVariants')[0].setAttribute("disabled", "");
        }
    }

    render() {
        return (
            <div className='order-bulk-product'>
                <div className='product-name'>{this.props.product.name}</div>
                <img src={this.props.product.defaultImage.url}></img>
                <div className='product-description'>{this.props.product.description.replace(/<[^>]+>/g, '').substr(0, 300)+'...'}</div>
                <div className='product-price'>{this.props.product.prices.price.value} {this.props.product.prices.price.currencyCode}</div>
                <div className='product-count'>
                     <input
                         type='number'
                         className='qtyField'
                         pattern='[0-9]{0,5}'
                         onInput={this.handleChange.bind(this)}
                         value={this.state.inputValue}/>
                </div>
            </div>
        )
    }
}