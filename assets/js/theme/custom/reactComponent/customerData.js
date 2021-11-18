import React from 'react';

export default class CustomerData extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container-order-page'>
                <div className='customer-data'>
                    <div className='title'>Customer Data</div>
                    <div>Order ID: {this.props.orderId}</div>
                    <div>Customer ID: {this.props.customerId}</div>
                    <div>First Name: {this.props.billingAddress.firstName}</div>
                    <div>last Name: {this.props.billingAddress.lastName}</div>
                    <div>Status: {this.props.status}</div>
                </div>
                <div className='billing-data'>
                    <div className='title'>Billing Data</div>
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
                    <div className='title'>Line items</div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Sku</th>
                                <th>Count</th>
                                <th>List price</th>
                            </tr>
                        </tbody>
                    {this.props.physicalItems.map((el)=>{
                        return (
                            <tbody key={el.id}>
                                <tr>
                                    <td className='td-name'>{el.name}</td>
                                    <td className='td-sku'>{el.sku}</td>
                                    <td className='td-quantity'>{el.quantity}</td>
                                    <td className='td-listPrice'>{el.listPrice}</td>
                                </tr>
                            </tbody>
                        )
                    })}
                    </table>
                    <div className='discount-amount'>Discount amount: {this.props.discountAmount}</div>
                    <div className='total'>Total: {this.props.orderAmount}</div>
                </div>
            </div>
        )
    }

}