import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import { View, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useClient, useTheme } from '.';
import { Text } from 'react-native-paper';
import styles, { full_width } from '../../Style/style';
import { Avatar } from '../Member';

const NotificationContainer = ({ children }) => {
    
    const { colors } = useTheme();
    const { client, user } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation()

    return (  
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center" }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack" , {
                    screen: "ProfileScreen",
                    params: {
                    nickname: user.nickname
                    }
                })}>
                <Avatar marginLeft={5} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{t("commons.notifications")}</Text>
            </Appbar.Header>
            { children }
        </View>
    )
};

export default NotificationContainer;