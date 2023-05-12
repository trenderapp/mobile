import React from "react";
import { View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import CustomHeader from "./CustomHeader";

type SectionProps = React.FC<{
    children: JSX.Element
}>

const ExploreContainer: SectionProps = ({ children }) => {

    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader title={t("commons.explore") as string} isHome={true} />
            {children}
        </View>
    )
};

export default ExploreContainer;