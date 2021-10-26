import React from 'react';
import nod from "nod-validate";

export default class ProductOptionsRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
        this.productVariantPrice = 0;
        this.Nod = nod();
        this.Nod.configure({submit: document.getElementById('productVariants'), disableSubmit: true});
        this.stock = this.props.variant.inventory?.aggregated.availableToSell;
    }

    handleChange(e) {
        const $input = $(e.target);
        const inputValue =  e.target.value.replace(/[^0-9]/g, "");
        this.setState({ inputValue });

        this.Nod.add([{
            selector:  $input,
            validate: function (callback, value){
                if (value>this.stock) {
                    callback(false);
                    $('#productVariants')[0].setAttribute("disabled", "");
                } else {
                    callback(true);
                    if( $('.form-field--error').length >= 1 ){
                        $('#productVariants')[0].setAttribute("disabled", "");
                    } else {
                        $('#productVariants')[0].removeAttribute("disabled");
                    }
                }
            }.bind(this),
            errorMessage: `${this.props.errorMessageStock }`
        }]);
        this.Nod.performCheck();

        this.productVariantPrice = e.target.value.replace(/[^\d]/g,'') * this.props.variant.prices.price.value;
        this.props.changeTotal(this.props.variant.entityId, this.productVariantPrice);
    }

    render() {
        return (
            <div className='form-product-option'>
                <div className='product-img'>
                    <img src={this.props.variant.defaultImage ? this.props.variant.defaultImage.url : "https://cdn11.bigcommerce.com/s-d1y3ufri1f/stencil/87d3dea0-180a-013a-b788-32ede3865cdc/img/ProductDefault.gif"}/>
                </div>
                <div className='product-sku'>{this.props.variant.sku}</div>
                <div className='product-price'>{this.props.variant.prices.price.value} {this.props.variant.prices.price.currencyCode}</div>
                <div className='product-variant-option'>
                    {this.props.variant.options.map((variantOption) => {
                        return ( <p key={variantOption.entityId}>
                                    {variantOption.displayName}: {variantOption.values[0].label}
                                </p>)
                        })
                    }
                </div>
                <div className='product-count'>
                    <input
                        type='text'
                        className='qtyField'
                        min='0'
                        value={this.state.inputValue}
                        onChange={this.handleChange.bind(this)}
                        pattern='[0-9]*'/>
                </div>
            </div>
        );
    }
}