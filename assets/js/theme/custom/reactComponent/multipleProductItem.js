import React from 'react';
import ProductOptionsRow from './productOptionRow';

export default class MultipleProductItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            variants: [],
        }
    }

    /**
     * Counts the sum of product variations
     * @param variantProductID
     * @param variantProductPrice
     */
    changeTotal(variantProductID, variantProductPrice) {
        let variantIndex = this.state.variants.findIndex((el) => el.id == variantProductID);
        // -1, not found
        if (variantIndex !== -1) {
            this.state.variants[variantIndex].value = variantProductPrice;
        } else {
            this.state.variants.push({id: variantProductID, value: variantProductPrice})
        }

        let total = this.state.variants.map((el) => el.value).reduce((a, b) => a + b, 0).toFixed(2);
        this.setState({
            total: total
        })
    }

    render() {
        return (
            <div className="containerDetailProduct">
                {this.props.variants.map((variant) => {
                        return (<ProductOptionsRow
                                    errorMessageStock={this.props.errorMessageStock}
                                    key={variant.id}
                                    variant={variant}
                                    total={this.state.total}
                                    changeTotal={this.changeTotal.bind(this)}/> )
                    })
                }
                <div className="total">
                    <button id="productVariants" className="button button--primary">Add to Cart</button>
                    <div className="total-price">
                        <span>Total price: </span>
                        <span id="totalPriceValue">{this.state.total}</span>
                        <span>UAH</span>
                    </div>
                </div>
             </div>
        )
    }
}