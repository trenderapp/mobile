import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Platform } from "react-native";
import { Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";
import { SettingsContainer, useNavigation } from '../../Components/Container';
import { HomeButtonSection } from '../../Components/Settings';
import { Br } from '../../Components/Elements/Text';
import { deviceInfo } from '../../Services';

function HomeSettingsScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const [appInfo, setAppInfo] = useState<any>(undefined);

    const getInfo = async () => {
        setAppInfo(await deviceInfo())
    }

    useEffect(() => {
        getInfo()
    }, [])

    const copyText = () => {
        Clipboard.setString(`App informations : ${JSON.stringify(appInfo)}`);
        Toast.show({ text1: t(`commons.success`) as string });
    }

    return (
        <SettingsContainer disconnect={true} title={t("settings.settings")}>
            <ScrollView>
                <Text variant='bodyLarge' style={{
                    textDecorationLine: "underline"
                }}>{t("settings.my_account")}:</Text>

                { Platform.OS !== "ios" && <HomeButtonSection onPress={() => navigation?.push("SubscriptionScreen")} t={t("settings.subscriptions")} /> }
                <HomeButtonSection onPress={() => navigation?.push("CustomSubscriptionScreen")} t={t("settings.custom_subscriptions")} />
                <HomeButtonSection onPress={() => navigation.push("AffiliationScreen")} t={t("settings.affiliation")} />
                <HomeButtonSection onPress={() => navigation.push("LanguageSpokenScreen")} t={t("settings.language_spoken")} />
                <Br />
                <Text variant='bodyLarge' style={{
                    textDecorationLine: "underline"
                }}>{t("settings.my_app")}:</Text>
                <HomeButtonSection onPress={() => navigation.push("LanguageThemeScreen")} t={t("settings.lang_and_theme")} />
                {appInfo && <HomeButtonSection onPress={() => copyText()} t={`${t("settings.app_version")} : ${appInfo.version} (${appInfo.build_number})`} icon={"content-copy"} />}
                <Br />
                <Text variant='bodyLarge' style={{
                    textDecorationLine: "underline"
                }}>{t("settings.my_security")}:</Text>
                <HomeButtonSection onPress={() => navigation.push("SessionScreen")} t={t("settings.sessions")} />
                <HomeButtonSection onPress={() => navigation.push("BlockedScreen")} t={t("settings.blocked")} />
                <HomeButtonSection onPress={() => navigation.push("SecurityScreen")} t={t("settings.security")} />
            </ScrollView>
        </SettingsContainer>
    )
}

export default HomeSettingsScreen;