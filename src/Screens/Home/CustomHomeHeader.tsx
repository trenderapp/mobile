import React from "react";
import { IconButton, Text } from 'react-native-paper';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import styles, { full_width } from '../../Style/style';
import { Avatar } from '../../Components/Member';
import { navigationProps } from '../../Services';
import { SafeAreaView } from "react-native-safe-area-context";
import { useClient, useTheme, useNavigation as useContainerNavigation } from "../../Components/Container";

type SectionProps = React.FC<{
    isHome?: boolean;
    title?: JSX.Element | string;
    leftComponent?: JSX.Element;
    children?: JSX.Element;
}>

const CustomHomeHeader: SectionProps = ({ leftComponent }) => {

    const navigation = useNavigation<navigationProps>();
    const containerNavigation = useContainerNavigation();
    const { client, user } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const SearchBar = () => (
        <TouchableOpacity
            onPress={() => containerNavigation.push("SearchStack")}
            style={{
                height: 40,
                width: "100%",
                borderRadius: 12,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.bg_secondary,
                shadowColor: colors.bg_third,
                shadowRadius: 8,
                shadowOpacity: 0.3,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
            }}>
            <View style={[styles.row]}>
                <IconButton size={18} icon="magnify" />
                <TextInput
                    editable={false}
                    placeholderTextColor={colors.text_normal}
                    placeholder={t("commons.search") + " ..."}
                    value=""
                    style={{
                        width: "75%",
                        color: colors.text_normal
                    }}
                />
            </View>
            <IconButton size={18} style={{ marginRight: 5, marginLeft: "auto" }} icon="tune-variant" />
        </TouchableOpacity>
    )

    return (
        <SafeAreaView>
            <View style={{ marginRight: 10, marginLeft: 10, marginTop: 5 }}>
                <View style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                    <View style={[styles.row, { justifyContent: "flex-end" }]}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.openDrawer()}>
                            <Avatar marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontWeight: '700', marginLeft: 5 }}>{user.username}</Text>
                            <Text variant="labelSmall" style={{ fontWeight: '700', marginLeft: 5, color: colors.text_muted }}>@{user.nickname}</Text>
                        </View>
                    </View>
                    {leftComponent && leftComponent}
                </View>
                { /**<SearchBar /> */ }
            </View>
        </SafeAreaView>
    )
}

export default CustomHomeHeader;