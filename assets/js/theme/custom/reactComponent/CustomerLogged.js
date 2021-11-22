import React from 'react';
import nod from "nod-validate";

export default class CustomerLogged extends React.Component {
    constructor(props) {
        super(props);
        this.Nod = nod();
        this.Nod.configure({submit: document.getElementById('productVariants'), disableSubmit: true});
    }
    handleChange(e) {
        const $input = $(e.target);
        this.Nod.add([{
            selector:  $input,
            validate: "integer",
            errorMessage: "Error integer"
        },
        {
            selector:  $input,
            validate: "max-length:10",
            errorMessage: "Error max 10"
        }]);
        this.Nod.performCheck();
    }

    render() {
        if(this.props.logged===null) {
            return (
                <div className="block">
                    <h1 className="page-heading">403 Error - no logged</h1>
                    <p className="u-textAlignCenter">
                        Uh oh, looks like the page you are looking for has moved or no longer exists.
                    </p>
                </div>
            )
        } else {
             return (
                 <div className="container-request-order">
                     <input
                        id="input-request-order"
                        className="form-input"
                        type="text"
                        onChange={this.handleChange.bind(this)}
                        ></input>
                     <button id="request-order-btn" className="button button--primary">Submit</button>
                 </div>
             )
        }
    }
}