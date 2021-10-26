import React from 'react';
import { render } from 'react-dom';
import ProductOptionsRow from './productOptionRow';
export default class MultipleProductItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalCost: 0,
            totalArr: [],
            quantity: 0,
            variants: [],
        }
        this.sumProduct = this.sumProduct.bind(this);
        this.changeTotalcost = this.changeTotalcost.bind(this);
    }
    onChange(e) {
    console.log('this.props', this.props.variants);
    console.log('this.state.variants', this.state.variants);
//        let countProductVariant = e.target.value;
//        console.log('countProductVariant', countProductVariant);
//        console.log('e', e.target);
//        this.setState({
//            totalCost: countProductVariant
//        })

    }
    sumProduct (a) {
        console.log('sum product');
        console.log('sumProduct a ', a);
        this.state.totalArr.push(a)
        console.log('this.state totalArr', this.state.totalArr);
    }

    changeTotalcost(variantCostObjectId, variantCostObjectValue) {
            let objIndex = this.state.variants.findIndex((obj => obj.id == variantCostObjectId));
            if (objIndex > -1) {
                this.state.variants[objIndex].value = variantCostObjectValue;
            } else {
                this.state.variants.push({id: variantCostObjectId, value: variantCostObjectValue})
            }
            let totalCostValue = this.state.variants
                .map((variant) => variant.value)
                .reduce((prev, next) => prev + next);

            this.setState({
                totalCost: totalCostValue
            })
        }

    render() {
        return ( <div className="container2">
                {this.props.variants.map((variant) => {
                        return (<ProductOptionsRow
                                key={variant.id}
                                variant={variant}
                                total={this.state.totalCost}
                                sumProduct = {this.sumProduct}
                                changeTotalcost = {this.changeTotalcost}
                                onChange={this.onChange.bind(this)}/> )
                    })
                }
                <div className="total">
                    <button id="productVariants" className="button button--primary">Submit</button>
                    <div className="total-price">
                        <span>Total price: </span>
                        <span id="totalPriceValue">{this.state.totalCost}</span>
                        <span>UAH</span>
                    </div>
                </div>
             </div>)
             }
}