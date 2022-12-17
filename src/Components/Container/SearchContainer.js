import React, { useState } from "react";
import { Appbar } from "react-native-paper";
import SearchBar from 'react-native-dynamic-search-bar';
import { Pressable, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";


import styles, { full_width } from "../../Style/style";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import useClient from "./Client/useClient";
import FastImage from "react-native-fast-image";

const SearchContainer = ({ children }) => {
    
    const { colors } = useTheme();
    const { client, user } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (  
        <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center", justifyContent: "space-evenly" }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack" , {
                    screen: "ProfileScreen",
                    params: {
                    nickname: user.nickname
                    }
                })}>
                    <FastImage source={{ uri: `${client.user.avatar(user.user_id, user.avatar)}`, cache: FastImage.cacheControl.web }} style={[ styles.pdp33, { marginLeft: 5 } ]} />
                </TouchableOpacity>
                <View>
                    <SearchBar
                        accessible={false}
                        searchIconImageStyle={{
                            tintColor: colors.text_normal
                        }}
                        clearIconImageStyle={{
                            tintColor: colors.text_normal
                        }}
                        placeholderTextColor={colors.text_normal}
                        style={{
                            backgroundColor: colors.bg_secondary
                        }}
                        textInputStyle={{
                            color: colors.text_normal
                        }}
                        placeholder={t("commons.search") + " ..."}
                        />
                        <Pressable onPress={() => navigation.navigate("SearchModal")} style={{
                            position: "absolute",
                            width: full_width,
                            height: 40
                        }} />
                </View>
            </Appbar.Header>
            { children }
        </View>
    )
};

export default SearchContainer;