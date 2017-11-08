import React, { Component } from "react";
import { connect } from "react-redux";

class Landing extends Component {

    render() {
        return (
            <div style={{textAlign:'center'}}>
                <h1>
                    Spotify-Notify
                </h1>
                Sign up for notifications when artist, or playlist you follow add new content. Daily.
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        // look at combined reducers, we called this piece of state - auth
        auth : state.auth
    };
}

export default connect(mapStateToProps)(Landing);
