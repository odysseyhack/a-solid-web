import React from "react";

class FriendsProfile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            friendsWebId: ""
        }
    }

    componentDidMount(){
        this.setState({
            friendsWebId: window.location.href.split("?")[1].split("=")[1]
        })
    }

    render(){
        return <p>{this.state.friendsWebId}</p>
    }
}

export default FriendsProfile;