import React from 'react';
import OrderBulkProductsRow from './OrderBulkProductsRow';

export default class OrderBulkProductsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('this.props.productsList3', this.props.productsList);
        return (
            <div className="containerDetailProduct">
                {this.props.productsList.map((el) => {
                        return (<OrderBulkProductsRow key={el.id} product={el}/> )
                    })
                }
                <div className="total">
                    <button id="productVariants" className="button button--primary">Add to Cart</button>
                    <div className="total-price">
                        <span>Total price: </span>
                        <span id="totalPriceValue"> </span>
                        <span>UAH</span>
                    </div>
                </div>
            </div>
        )
    }
}