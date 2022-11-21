import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { HomeButtonSection } from '../../Components/Settings';

function HomeSettingsScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation()

    return (
        <SettingsContainer disconnect>
            <HomeButtonSection onPress={() => navigation.push("AffiliationScreen")} t={t("settings.affiliation")} />
            <HomeButtonSection onPress={() => navigation.push("LanguageThemeScreen")} t={t("settings.lang_and_theme")} />
            <HomeButtonSection onPress={() => navigation.push("BlockedScreen")} t={t("settings.blocked")} />
            <HomeButtonSection onPress={() => navigation.push("SessionScreen")} t={t("settings.sessions")} />
            <HomeButtonSection onPress={() => navigation.push("SecurityScreen")} t={t("settings.security")} />
        </SettingsContainer>
    )
}

export default HomeSettingsScreen;