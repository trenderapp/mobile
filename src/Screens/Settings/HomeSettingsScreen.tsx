import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { HomeButtonSection } from '../../Components/Settings';

function HomeSettingsScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation()

    return (
        <SettingsContainer disconnect={true} title={t("settings.settings")}>
            <HomeButtonSection onPress={() => navigation?.push("AffiliationScreen")} t={t("settings.affiliation")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("LanguageThemeScreen")} t={t("settings.lang_and_theme")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("BlockedScreen")} t={t("settings.blocked")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("SessionScreen")} t={t("settings.sessions")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("SecurityScreen")} t={t("settings.security")} icon={undefined} />
            <HomeButtonSection onPress={() => navigation?.push("SubscriptionScreen")} t={t("settings.subscriptions")} icon={undefined} />
        </SettingsContainer>
    )
}

export default HomeSettingsScreen;