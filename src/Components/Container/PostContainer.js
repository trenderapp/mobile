import React from "react";
import { Appbar, Text } from "react-native-paper";
import { full_width } from "../../Style/style";

import { View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import useNavigation from "./Navigation/useNavigation";

const PostContainer = ({ children }) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation()

    return (  
        <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center" }}>
                <Appbar.BackAction onPress={() => navigation ? navigation.goBack() : null} />
                <Text>{t("posts.discussion")}</Text>
            </Appbar.Header>
            { children }
        </View>
    )
};

export default PostContainer;