import React from "react";
import { Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import styles, { full_width } from '../../Style/style';
import { Avatar } from '../../Components/Member';
import { navigationProps } from '../../Services';
import { useClient, useTheme } from "../../Components/Container";

type SectionProps = React.FC<{
    isHome?: boolean;
    title?: JSX.Element | string;
    leftComponent?: JSX.Element;
    children?: JSX.Element;
}>

const CustomHomeHeader: SectionProps = ({ leftComponent }) => {

    const navigation = useNavigation<navigationProps>();
    const { client, user } = useClient();
    const { colors } = useTheme();

    return (
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
        </View>
    )
}

export default CustomHomeHeader;