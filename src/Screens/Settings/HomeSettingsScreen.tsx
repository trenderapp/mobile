import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import { SettingsContainer, useNavigation } from '../../Components/Container';
import { HomeButtonSection } from '../../Components/Settings';
import { Br } from '../../Components/Elements/Text';

function HomeSettingsScreen() {
  
    const { t } = useTranslation();
    const navigation = useNavigation()
  
    return (
        <SettingsContainer disconnect={true} title={t("settings.settings")}>
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>My account:</Text>
            {
                // <HomeButtonSection onPress={() => navigation?.push("SubscriptionScreen")} t={t("settings.subscriptions")} icon={undefined} />
            }
            {  
                <HomeButtonSection onPress={() => navigation.push("AffiliationScreen")} t={t("settings.affiliation")} icon={undefined} />
            }
            <Br />
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>My App:</Text>
            <HomeButtonSection onPress={() => navigation.push("LanguageThemeScreen")} t={t("settings.lang_and_theme")} icon={undefined} />
            <Br />
            <Text variant='bodyLarge' style={{
                textDecorationLine: "underline"
            }}>Security :</Text>
            <HomeButtonSection onPress={() => navigation.push("BlockedScreen")} t={t("settings.blocked")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation.push("SessionScreen")} t={t("settings.sessions")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation.push("SecurityScreen")} t={t("settings.security")} icon={undefined} />
        </SettingsContainer>
    )
}

export default HomeSettingsScreen;