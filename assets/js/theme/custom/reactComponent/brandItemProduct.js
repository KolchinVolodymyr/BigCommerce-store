import React from 'react';

export default class BrandItemProduct extends React.Component {

    render() {
    if(this.props.brandsList.length==0) {
        return (
            <ul className="brandGrid">
                <div className="brand">
                    No brands found
                </div>
            </ul>
        )
    }
        return (
            <ul className="brandGrid">
                {this.props.brandsList
                    .map((el)=>{
                        return (
                            <li className="brand" key={el.id}>
                                <article className="card">
                                    <figure className="card-figure">
                                        <a className="card-figure__link" aria-label={el.name} href={el.path}>
                                            <div className="card-img-container">
                                                <img className="card-image ls-is-cached lazyloaded" src='https://cdn11.bigcommerce.com/s-qe352b9ase/stencil/48c627e0-229b-013a-2f06-5ec2a6edaf2e/img/BrandDefault.gif'></img>
                                            </div>
                                        </a>
                                    </figure>
                                    <div className="card-body">
                                        <h3 className="card-title">
                                            <a href={el.path}>{el.name}</a>
                                        </h3>
                                    </div>
                                </article>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}