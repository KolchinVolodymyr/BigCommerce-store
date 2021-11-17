import React from 'react';

export default class CustomerData extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('q', this.props);
        return (
            <div className='container-order-page'>
                <div className='customer-data'>
                    <div>Customer Data</div>
                    <div>Order ID: {this.props.orderId}</div>
                    <div>First Name:{this.props.billingAddress.firstName}</div>
                    <div>last Name: {this.props.billingAddress.lastName}</div>
                    <div>Status: {this.props.status}</div>
                </div>
                <div className='billing-data'>
                    <div>Billing address</div>
                    <div>First name: {this.props.billingAddress.firstName}</div>
                    <div>last name: {this.props.billingAddress.lastName}</div>
                    <div>Billing address1: {this.props.billingAddress.address1}</div>
                    <div>Billing address2: {this.props.billingAddress.address2}</div>
                    <div>City: {this.props.billingAddress.city}</div>
                    <div>Company: {this.props.billingAddress.city}</div>
                    <div>Country: {this.props.billingAddress.country}</div>
                    <div>Country code: {this.props.billingAddress.countryCode}</div>
                    <div>Email: {this.props.billingAddress.email}</div>
                    <div>Phone: {this.props.billingAddress.phone}</div>
                    <div>Postal code: {this.props.billingAddress.postalCode}</div>
                    <div>State or province: {this.props.billingAddress.stateOrProvince}</div>
                    <div>State or province code: {this.props.billingAddress.stateOrProvinceCode}</div>
                </div>
                <div className='line-data'>
                    <div>Line items</div>
                    {this.props.physicalItems.map((el)=>{
                        return (
                            <div key={el.id} className='line-data-items'>
                                <div>Name: {el.name}</div>
                                <div>Sku: {el.sku}</div>
                                <div>count: {el.quantity}</div>
                                <div>List price: {el.listPrice}</div>
                            </div>
                        )
                    })}
                    <div>Discount amount:{this.props.discountAmount}</div>
                    <div>Total: {this.props.orderAmount}</div>
                </div>
            </div>
        )
    }

}