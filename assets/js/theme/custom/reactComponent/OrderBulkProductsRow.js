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
                <img src={this.props.product.defaultImage ? this.props.product.defaultImage.url: "https://cdn11.bigcommerce.com/s-qe352b9ase/stencil/48c627e0-229b-013a-2f06-5ec2a6edaf2e/img/BrandDefault.gif"}></img>
                <div className='product-description'>{this.props.product.description.replace(/<[^>]+>/g, '').substr(0, 300)+'...'}</div>
                <div className='product-price'>{this.props.product.prices.price.value} {this.props.product.prices.price.currencyCode}</div>
                <div className='product-count'>
                    {this.props.product.inventory?.aggregated?.availableToSell===0
                    ?
                        <div className='container-out-of-stock'>
                            <div className="alertBox-column alertBox-icon">
                                <div glyph="ic-error" className="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></div>
                            </div>
                            <p className="alertBox-column alertBox-message">
                                <span id="alertBox-message-text">Out of stock</span>
                            </p>
                            <input type='number' className='qtyField'/>
                        </div>
                    :
                        <input
                            type='number'
                            className='qtyField'
                            pattern='[0-9]{0,5}'
                            onInput={this.handleChange.bind(this)}
                            value={this.state.inputValue}/>}
                </div>
            </div>
        )
    }
}