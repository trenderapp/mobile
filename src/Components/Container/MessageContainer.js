import React from "react";
import { Appbar, Text } from "react-native-paper";
import { full_width } from "../../Style/style";

import { ScrollView, View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const SettingsContainer = ({ children, title, noScroll }) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation()

    return (  
        <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center" }}>
                <Appbar.BackAction onPress={() => navigation ? navigation.goBack() : null} />
                <Text>{title ? title : t("commons.messages")}</Text>
            </Appbar.Header>
            { noScroll ? children : <ScrollView>{children}</ScrollView>}
        </View>
    )
};

export default SettingsContainer;