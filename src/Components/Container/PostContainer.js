import React from "react";

import { View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import CustomHeader from "./CustomHeader";

const PostContainer = ({ children }) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (  
        <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader title={t("posts.discussion")} />
            { children }
        </View>
    )
};

export default PostContainer;