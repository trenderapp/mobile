import React from 'react';
import { WebView } from "react-native-webview";
import { useTranslation } from 'react-i18next';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Loader } from '../../Other';

function SubscriptionDashboardScreen({ route }) {

    const { t } = useTranslation();
    const { url } = route.params;

    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            { url ? <WebView source={{ uri: url }} /> : <Loader /> }
        </SettingsContainer>
    )
}

export default SubscriptionDashboardScreen;