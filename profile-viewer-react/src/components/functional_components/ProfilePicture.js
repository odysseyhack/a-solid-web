import React from "react";

const ProfilePicture = (props) => {
    return (
        <label htmlFor="profilePictureUpload">
            <img src={props.picture} width="100%" height="100%" alt="This is the ProfilePicture"></img>
        <input
          id="profilePictureUpload"
          name="profilePictureUpload"
          type="file"
          style={{display: "none"}}
          onChange={props.onChange}
          accept="image/*"
        />
      </label>
    )
}

export default ProfilePicture;