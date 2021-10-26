import React from 'react';
import { render } from 'react-dom';

export default class ProductOptionsRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalProduct: []
        }
//        this.arr = [];
        //this.handleChange = this.handleChange.bind(this);
         //this.updateQuantity = this.updateQuantity.bind(this);
    }
//    updateQuantity(value){
//        let variantCost = value * this.props.variant.prices.price.value;
//        this.setState({
//            variantCost: variantCost
//        })
//        this.props.changeTotalcost(this.props.variant.entityId, variantCost);
//    }


    handleChange(evt) {
        const inputValue = (evt.target.validity.valid) ? evt.target.value : this.state.inputValue;
        this.setState({ inputValue });
       // this.updateQuantity(inputValue);

           let variantCost = inputValue * this.props.variant.prices.price.value;
           this.setState({
               variantCost: variantCost
           })
           this.props.changeTotalcost(this.props.variant.entityId, variantCost);

    }

    render() {
        return (
            <div className='form-product-option'>
                <div className='product-img'>
                    <img src={this.props.variant.defaultImage ? this.props.variant.defaultImage.url : ""}/>
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
                        onChange={this.handleChange.bind(this)}
                        pattern='[0-9]*'/>
                </div>
            </div>
        );
    }
}