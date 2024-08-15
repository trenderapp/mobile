import React, { PropsWithChildren } from "react";

import SafeBottomContainer from "./SafeBottomContainer";
import CustomHeader from "./CustomHeader";

type SectionProps = PropsWithChildren<{
  title: string;
  leftComponent?: JSX.Element
}>

const SettingsContainer = ({ children, title, leftComponent = undefined }: SectionProps) => {

  return (
    <SafeBottomContainer padding={undefined}>
      <CustomHeader title={title} isHome={false} leftComponent={leftComponent} />
      {children}
    </SafeBottomContainer>
  )
};

export default SettingsContainer;