import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Platform, Alert } from "react-native";
import { Appbar, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";
import { useRealm } from '@realm/react';

import { SettingsContainer, useClient, useNavigation, useTheme } from '../../Components/Container';
import { HomeButtonSection } from '../../Components/Settings';
import { Br } from '../../Components/Elements/Text';
import { deviceInfo } from '../../Services';
import { deleteUser, getAllUsers } from '../../Services/Realm/userDatabase';
import Client from 'trender-client';
import { apibaseurl } from '../../Services/constante';
import { clearStorage, setStorage } from '../../Services/storage';

function HomeSettingsScreen() {

  const { t } = useTranslation();
  const navigation = useNavigation();
  const [appInfo, setAppInfo] = useState<any>(undefined);
  const { colors } = useTheme();
  const client = useClient();
  const realm = useRealm();

  const getInfo = async () => {
    setAppInfo(await deviceInfo())
  }

  useEffect(() => {
    getInfo()
  }, [])

  const Disconnect = () => {
    Alert.alert(t("settings.logout"), t("settings.sure_logout"), [
      {
        text: t("commons.no"),
        style: "cancel"
      },
      {
        text: t("commons.yes"),
        onPress: async () => {
          await client.client.user.logout();
          deleteUser(realm, client.user.user_id)

          client.setValue({ ...client, client: client.client, token: client.token, user: client.user, state: "switch_user" })
        },
        style: "default"
      }
    ])
  }

  const copyText = () => {
    Clipboard.setString(`App informations : ${JSON.stringify(appInfo)}`);
    Toast.show({ text1: t(`commons.success`) as string });
  }

  return (
    <SettingsContainer leftComponent={<Appbar.Action color={colors.text_normal} icon="exit-to-app" onPress={() => Disconnect()} />} title={t("settings.settings")}>
      <ScrollView>
        <Text variant='bodyLarge' style={{
          textDecorationLine: "underline"
        }}>{t("settings.my_account")}:</Text>

        {Platform.OS !== "ios" && <HomeButtonSection onPress={() => navigation?.push("SubscriptionScreen")} t={t("settings.subscriptions")} />}
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