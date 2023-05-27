import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next"
import SearchBar from 'react-native-dynamic-search-bar';;
import { useNavigation } from '@react-navigation/native';
import useTheme from "./Theme/useTheme";
import CustomHeader from "./CustomHeader";
import { navigationProps } from "../../Services";

type SectionProps = React.FC<{
    children: JSX.Element
}>

const ExploreContainer: SectionProps = ({ children }) => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const [text, setText] = useState("");
    const navigation = useNavigation<navigationProps>();

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader isHome={true}>
            <SearchBar
                    searchIconImageStyle={{
                        tintColor: colors.text_normal
                    }}
                    clearIconImageStyle={{
                        tintColor: colors.text_normal
                    }}
                    placeholderTextColor={colors.text_normal}
                    style={{
                        backgroundColor: colors.bg_secondary,
                        width: 320
                    }}
                    textInputStyle={{
                        color: colors.text_normal
                    }}
                    placeholder={t("commons.search") + " ..."}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                    onClearPress={() => setText("")}
                    onSearchPress={() => navigation?.navigate("PostStack", {
                        screen: "PostScreenSearch",
                        params: {
                            query: text
                        }
                    })}
                />
            </CustomHeader>
            {children}
        </View>
    )
};

export default ExploreContainer;