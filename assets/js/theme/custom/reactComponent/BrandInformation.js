import React from 'react';

export default class BrandInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-brand">
                <div className="img-brand"><img src={this.props.defaultImage? this.props.defaultImage.url: "https://cdn11.bigcommerce.com/s-qe352b9ase/stencil/48c627e0-229b-013a-2f06-5ec2a6edaf2e/img/BrandDefault.gif"}/></div>
                    <div>
                        <div className="name-brand">{this.props.name}</div>
                        <div className="metaDesc-brand">{this.props.metaDesc}</div>
                    </div>
            </div>
        )
    }
}