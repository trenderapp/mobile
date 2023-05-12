import React from 'react';
import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import { CustomHeader, useTheme } from '.';

const NotificationContainer = ({ children }) => {
    
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (  
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader title={t("commons.notifications")} />
            { children }
        </View>
    )
};

export default NotificationContainer;