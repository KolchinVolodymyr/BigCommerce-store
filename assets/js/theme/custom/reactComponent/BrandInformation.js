import React from 'react';

export default class BrandInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-brand">
                <div className="img-brand"><img src={this.props.image}/></div>
                    <div>
                        <div className="name-brand">{this.props.name}</div>
                        <div className="metaDesc-brand">{this.props.metaDesc}</div>
                    </div>
            </div>
        )
    }
}