import React from "react";
import Image from "react-bootstrap/Image";
import { Typography, ListItem } from "yoda-design-system";
const ContactSlot = props => {
  const friend = props.friend;
  return (
    <ListItem>
        <Image fluid width="4%" src={friend.picture} />
        <Typography variant="paragraph">{friend.name}</Typography>
    </ListItem>
  );
};

export default ContactSlot;
