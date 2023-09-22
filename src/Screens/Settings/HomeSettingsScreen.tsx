import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  
    const copyText = (text: string) => {
        Clipboard.setString(text);
        Toast.show({ text1: t(`commons.success`) as string});
    }

    return (
        <SettingsContainer disconnect={true} title={t("settings.settings")}>
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>{t("settings.my_account")}:</Text>

            <HomeButtonSection onPress={() => navigation?.push("SubscriptionScreen")} t={t("settings.subscriptions")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("CustomSubscriptionScreen")} t={t("settings.custom_subscriptions")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation.push("LanguageSpokenScreen")} t={t("settings.language_spoken")} icon={undefined} />

            <HomeButtonSection onPress={() => navigation.push("AffiliationScreen")} t={t("settings.affiliation")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation.push("SessionScreen")} t={t("settings.sessions")} icon={undefined} />
            <Br />
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>{t("settings.my_app")}:</Text>
            <HomeButtonSection onPress={() => navigation.push("LanguageThemeScreen")} t={t("settings.lang_and_theme")} icon={undefined} />
            { appInfo && <HomeButtonSection onPress={() => copyText(`App version : ${appInfo.version} (${appInfo.build_number})`)} t={`${t("settings.app_version")} : ${appInfo.version} (${appInfo.build_number})`} icon={"content-copy"} /> }
            <Br />
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>{t("settings.my_security")}:</Text>
            <HomeButtonSection onPress={() => navigation.push("BlockedScreen")} t={t("settings.blocked")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation.push("SecurityScreen")} t={t("settings.security")} icon={undefined} />
        </SettingsContainer>
    )
}

export default HomeSettingsScreen;