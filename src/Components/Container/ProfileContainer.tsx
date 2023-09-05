import React, { PropsWithChildren  } from "react";
import { SafeBottomContainer } from ".";

type SectionProps = PropsWithChildren

const ProfileContainer = ({ children }: SectionProps) => {

  return (
    <SafeBottomContainer padding={0}>
      {children}
    </SafeBottomContainer>
  )
};

export default ProfileContainer;