import React from "react";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Appbar, Text } from "react-native-paper";
import styles, { full_width } from "../../Style/style";

import { Alert, View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import useClient from "./Client/useClient";
import SafeBottomContainer from "./SafeBottomContainer";
import { currentFcmToken } from "../../Services/notifications";

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
              const fcmToken = await currentFcmToken();
              if(fcmToken) await client.client.pushNotification.delete(fcmToken)
              
              EncryptedStorage.clear().then(() => {
                client.setValue({
                  ...client,
                  state: "logout"
                })
                return navigation.replace("LoginNavigator", { screen: "Login" })
              })     
            },
            style: "default"
          }
        ])
      }
      
    return (  
        <SafeBottomContainer>
            <Appbar.Header style={[styles.row, { width: full_width, backgroundColor: colors.bg_primary, justifyContent: "space-between" }]}>
                <View style={styles.row}>
                    <Appbar.BackAction onPress={() => navigation ? navigation.goBack() : null} />
                    <Text>{title ? title : t("commons.settings")}</Text>
                </View>
                { disconnect && <Appbar.Action color={colors.text_normal} icon="exit-to-app" onPress={() => Disconnect()} /> }
            </Appbar.Header>
            { children }
        </SafeBottomContainer>
    )
};

export default SettingsContainer;