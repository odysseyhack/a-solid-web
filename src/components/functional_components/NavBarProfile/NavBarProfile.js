import React from "react";
import Image from "react-bootstrap/Image"

const NavBarProfile = (props) => {
    return (
        <span>
            <Image width="6%" src={props.picture}/>
            <p>{props.name}</p>
        </span>
    )
}

export default NavBarProfile;