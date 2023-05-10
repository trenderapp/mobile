import React from "react";
import { Appbar, Text } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import styles, { full_width } from "../../Style/style";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import useClient from "./Client/useClient";
import { Avatar } from "../Member";
import { RootStackParamList } from "../../Services";

type SectionProps = React.FC<{
    children: JSX.Element
}>

const ExploreContainer: SectionProps = ({ children }) => {

    const { colors } = useTheme();
    const { client, user } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Bottom'>>();

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", alignContent: "center", justifyContent: "space-between" }}>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack", {
                        screen: "ProfileScreen",
                        params: {
                            nickname: user.nickname
                        }
                    })}>
                        <Avatar marginLeft={5} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{t("commons.explore")}</Text>
                </View>
            </Appbar.Header>
            {children}
        </View>
    )
};

export default ExploreContainer;