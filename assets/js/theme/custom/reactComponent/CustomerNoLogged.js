import React from 'react';

export default class CustomerNoLogged extends React.Component {

    render() {
        return (
            <div className="block">
                <h1 class="page-heading">403 Error - no logged</h1>
                <p class="u-textAlignCenter">
                    Uh oh, looks like the page you are looking for has moved or no longer exists.
                </p>
            </div>
        )
    }
}