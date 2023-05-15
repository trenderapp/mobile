import React from "react";
import { CustomHeader, SafeBottomContainer } from ".";

const ProfileContainer = ({ children, username }) => {

    return (
      <SafeBottomContainer>
          <CustomHeader title={username ?? "..."} />
          { children }
      </SafeBottomContainer>
    )
};

export default ProfileContainer;