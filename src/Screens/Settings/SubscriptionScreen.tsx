import React, { useState, useEffect } from 'react';
import { Button, Text, Card, Portal, Dialog } from 'react-native-paper';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { useClient, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import NormalCard from '../../Components/Subscriptions/NormalCard';
import StandardCard from '../../Components/Subscriptions/StandardCard';
import EliteCard from '../../Components/Subscriptions/EliteCard';
import { SubscriptionInterface } from 'trender-client';
import { openURL } from '../../Services';

function SubscriptionScreen() {

    const { t } = useTranslation();
    const { client, user } = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState<SubscriptionInterface.getSubscriptionsResponseInterface[]| undefined>(undefined);

    const hideDialog = () => setVisible(false);

    const openDashboardPage = async () => {
        if (loading) return;
        setLoading(true)
        const request = await client.subscription.dashboard(user.user_id);

        const response = request;

        if (response.data) {
            hideDialog()
            setLoading(false)
            openURL(response.data.url)

        } else {
            hideDialog()
            setLoading(false)
            Toast.show({ text1: t(`errors.${request?.error?.code}`) as string });
        }
    }

    const getSubscriptions = async () => {
        const request = await client.subscription.fetch();        
        const response = request.data;
        if (response) return setSubscriptions(response)
    }

    useEffect(() => {
        getSubscriptions()
    }, [])

    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            <ScrollView>
                <Card style={{
                    backgroundColor: colors.bg_secondary,
                    margin: 5
                }}>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>{t("subscription.cancel")}</Dialog.Title>
                            <Dialog.Content>
                                <Text>{t("subscription.will_end")}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                                <Button uppercase={false} onPress={() => openDashboardPage()}>{t("commons.continue")}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Card.Content>
                        <Text variant="titleLarge">{t("subscription.current")}</Text>
                        <Text variant="bodyMedium">{user.premium_type === 0 ? "Free" : user.premium_type === 1 ? "Standard" : user.premium_type === 2 ? "Premium" : user.premium_type === 3 ? "Elite" : "Custom"}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button loading={loading} focusable={!loading} onPress={() => openDashboardPage()}>{t("subscription.dashboard")}</Button>
                    </Card.Actions>
                </Card>
                <StandardCard subs={subscriptions ? subscriptions.filter(s => s.premium_type === 1) : undefined} />
                { /*<PremiumCard subs={subscriptions ? subscriptions.filter(s => s.premium_type === 2) : undefined} />*/ }
                <EliteCard subs={subscriptions ? subscriptions.filter(s => s.premium_type === 3) : undefined} />
                <NormalCard />
            </ScrollView>
        </SettingsContainer>
    )
}

export default SubscriptionScreen;