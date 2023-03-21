import React, { useState } from 'react';
import { Button, Text, Card, Portal, Dialog } from 'react-native-paper';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { useClient, useNavigation, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import NormalCard from '../../Components/Subscriptions/NormalCard';
import StandardCard from '../../Components/Subscriptions/StandardCard';
import PremiumCard from '../../Components/Subscriptions/PremiumCard';
import EliteCard from '../../Components/Subscriptions/EliteCard';
import { axiosInstance } from '../../Services';

function SubscriptionScreen() {

    const navigation = useNavigation()
    const { t } = useTranslation();
    const { user } = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const hideDialog = () => setVisible(false);

    const openDashboardPage = async () => {
        if (loading) return;
        setLoading(true)
        const request = await axiosInstance.get("/subscriptions/dashboard", {
            headers: {
                "trendertokenapi": user.token
            }
        })

        const response = request.data;

        if (response.data) {
            hideDialog()
            setLoading(false)
            navigation?.push("SubscriptionValidationScreen", {
                url: response.data.url
            })

        } else {
            hideDialog()
            setLoading(false)
            Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        }
    }

    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            <ScrollView>
                <Card style={{
                    backgroundColor: colors.bg_secondary,
                    margin: 5
                }}>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>Cancel your subscription ?</Dialog.Title>
                            <Dialog.Content>
                                <Text>Your subscription will end at the end of period</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                                <Button uppercase={false} onPress={() => openDashboardPage()}>{t("commons.continue")}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Card.Content>
                        <Text variant="titleLarge">Current subscription</Text>
                        <Text variant="bodyMedium">{user.premium_type === 0 ? "Free" : user.premium_type === 1 ? "Standard" : user.premium_type === 2 ? "Premium" : user.premium_type === 3 ? "Elite" : "Custom"}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => openDashboardPage()}>dashboard</Button>
                    </Card.Actions>
                </Card>
                <StandardCard />
                <EliteCard />
                <PremiumCard />
                <NormalCard />
            </ScrollView>
        </SettingsContainer>
    )
}

export default SubscriptionScreen;