import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { CustomHeader, useClient, useTheme } from '.';
import { useDispatch } from 'react-redux';
import { readNotificationFeed } from '../../Redux/NotificationFeed/action';

const NotificationContainer = ({ children }: React.PropsWithChildren) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { client } = useClient();
    const dispatch = useDispatch();

    const ReadAll = async () => {
        await client.notification.read();
        Toast.show({ text1: t(`commons.success`) as string })
        dispatch(readNotificationFeed())
    }

    return (  
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader title={t("commons.notifications") as string} leftComponent={<IconButton icon="delete-sweep" onPress={() => ReadAll()}/>} />
            { children }
        </View>
    )
};

export default NotificationContainer;