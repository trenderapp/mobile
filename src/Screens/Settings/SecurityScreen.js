import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView } from 'react-native';
import { Text, Button, Dialog, Paragraph, Portal, TextInput as PaperTextInput } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { TextInput } from '../../Components/Elements/Input';
import { axiosInstance, cguLink, cgvLink, openURL } from '../../Services';
import { useNavigation } from "@react-navigation/native";
import { HomeButtonSection } from '../../Components/Settings';
import { clearStorage } from '../../Services/storage';

function SecurityScreen() {

    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const client = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation();

    const hideDialog = () => setVisible(false);

    const deleteAccount = async () => {
        if (loading) return;
        setLoading(true);

        const request = await axiosInstance.delete(`/users/me`, {
            headers: {
                'trendertokenapi': client.token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "password": password
            })
        })

        const response = request.data;

        setLoading(false);
        if (response.error) return setError(t(`errors.${response.error.code}`));

        clearStorage("user_info")
        return navigation.replace("LoginNavigator", { screen: "Login" })
    }

    const changeNSFW = async () => {
        setLoading(true)
        const request = await client.client.user.edit({ nsfw_filter: !client.user.nsfw_filter });
        setLoading(false)
        if (!request.data) return;
        return client.setValue({
            ...client,
            user: {
                ...client.user,
                nsfw_filter: !client.user.nsfw_filter
            }
        })
    }

    return (
        <SettingsContainer title={t("settings.security")}>
            <Button style={{ alignItems: "flex-start", marginLeft: 5 }} onPress={() => changeNSFW()} loading={loading} icon={client.user.nsfw_filter ? "lock" : "lock-open-variant"} >{t("settings.protect_nsfw")}</Button>
            <HomeButtonSection onPress={() => openURL(cguLink(i18n.language))} t={t("settings.t_and_s")} />
            <HomeButtonSection onPress={() => openURL(cgvLink(i18n.language))} t={t("settings.t_of_s")} />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{t("settings.delete_account")}</Dialog.Title>
                    {error.length > 0 && <Dialog.Content>
                        <Text style={{ color: colors.warning_color }}>{error}</Text>
                    </Dialog.Content>}
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                            <Paragraph>
                                {t("settings.sure_delete_account")}
                            </Paragraph>
                            <TextInput
                                label={`${t("login.password")}`}
                                autoCapitalize="none"
                                secureTextEntry={showPass}
                                returnKeyType="next"
                                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} />}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                        <Button uppercase={false} loading={loading} onPress={() => deleteAccount()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Button onPress={() => setVisible(true)}>{t("settings.delete_account")}</Button>
        </SettingsContainer>
    )
}

export default SecurityScreen;