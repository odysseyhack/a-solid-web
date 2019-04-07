import React from "react";
import { Typography } from "yoda-design-system"
const ContactSlot = (props) => {
    const friend = props.friend
    return(
        <Typography variant="paragraph">{friend.name}</Typography>
    )
}

export default ContactSlot;