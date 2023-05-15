import React from "react";

import { ScrollView, View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import CustomHeader from "./CustomHeader";

type SectionProps = React.FC<{
    children: JSX.Element, 
    title?: string, 
    noScroll?: boolean
}>

const MessageContainer: SectionProps = ({ children, title, noScroll }) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (  
        <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader title={title ? title : t("commons.messages") as string} />
            { noScroll ? children : <ScrollView>{children}</ScrollView>}
        </View>
    )
};

export default MessageContainer;