import React from "react";
import Image from "react-bootstrap/Image";
import NavLink from "react-bootstrap/NavLink"
import { Typography, ListItem } from "yoda-design-system";

const ContactSlot = props => {
  const friend = props.friend;
  return (
    <ListItem>
      <Image fluid width="4%" src={friend.picture} />
      <a
        href={"/friend?webId=" + friend.webId}
        style={{ color: "#000", marginLeft: "10%" }}
      >
      <Typography variant="paragraph">{friend.name}</Typography>
      </a>
    </ListItem>
  );
};

export default ContactSlot;
