import React from 'react';

export default class BrandItemProduct extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('hii', this.props.brandsList);
        console.log('value', this.props.value);
        return (
            <ul className="brandGrid">
                { this.props.brandsList
                    .filter(el => el.name.toLowerCase().startsWith(this.props.value))
                    .map((el)=>{
                        return (
                            <div className='brand' key={el.id}>{el.name}</div>
                        )
                })}
            </ul>
        )
    }
}