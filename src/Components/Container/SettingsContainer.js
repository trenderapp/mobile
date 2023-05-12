import React from "react";
import { Appbar } from "react-native-paper";

import { Alert } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import useClient from "./Client/useClient";
import SafeBottomContainer from "./SafeBottomContainer";
import { clearStorage } from "../../Services/storage";
import CustomHeader from "./CustomHeader";

const SettingsContainer = ({ children, title, disconnect = false }) => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const client = useClient();

  const navigation = useNavigation()

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
          clearStorage("user_info")
          client.setValue({
            ...client,
            state: "logout"
          })
          return navigation.replace("LoginNavigator", { screen: "Login" })
        },
        style: "default"
      }
    ])
  }

  return (
    <SafeBottomContainer>
      <CustomHeader title={title} isHome={false} leftComponent={disconnect && <Appbar.Action color={colors.text_normal} icon="exit-to-app" onPress={() => Disconnect()} />} />
      {children}
    </SafeBottomContainer>
  )
};

export default SettingsContainer;