import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Button, Text, Card, TextInput } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { axiosInstance, navigationProps } from '../../Services';
import { useClient, SettingsContainer, useNavigation as useAppNavigation, useTheme } from '../../Components/Container';
import { SubscriptionInterface } from 'trender-client';

function SubscriptionValidationScreen({ route }: any) {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation<navigationProps>();
    const appNavigation = useAppNavigation();
    const client = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const { subscription, title }: { subscription: SubscriptionInterface.getSubscriptionsResponseInterface; title: string } = route.params;

    const fetchPaymentSheetParams = async (subscription_id: string, coupon_id?: string) => {
        const request = await axiosInstance.post(`/subscriptions/${subscription_id}/checkout`, { coupon_id: coupon_id }, {
            headers: {
                "trendertokenapi": client.user.token
            }
        })

        const response = request.data;
        if (response.data) {
            if (response.data.url) {
                appNavigation?.replace("SubscriptionDashboardScreen", {
                    url: response.data.url
                })
                setLoading(false)
                return;
            } else {
                const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;
                return { paymentIntent, ephemeralKey, customer, publishableKey };
            }
        } else {
            Toast.show({ text1: t(`errors.${response.error.code}`) as string });
            return;
        }
    };

    const initializePaymentSheet = async (subscription_id: string) => {
        const request = await fetchPaymentSheetParams(subscription_id);
        if (!request) return Toast.show({ text1: `[50] Error` });;
        const { paymentIntent, ephemeralKey, customer } = request;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Trender, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });
        setLoading(false)
        if (error) return console.log(error);
    };

    const openPaymentSheet = async () => {
        setLoading(true)
        const { error } = await presentPaymentSheet();

        if (error) {
            console.log(error);
            Toast.show({ text1: `Error : ${error.message}` });
            setLoading(false)
        } else {
            client.setValue({
                ...client,
                user: {
                    ...client.user,
                    premium_type: subscription.premium_type
                }
            })
            Toast.show({ text1: `Success Your order is confirmed!` });
            setTimeout(() => {
                appNavigation.replace("DrawerNavigation")
            }, 500)
        }
    };

    useEffect(() => {
        initializePaymentSheet(subscription.subscription_id)
    }, [subscription])

    return (
        <SettingsContainer title={t("settings.subscriptions_checkout")}>
            <Card>
                <Card.Content>
                    <Text variant="titleLarge">{t("subscription.recap")} :</Text>
                    <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.subscription") as string} value={title} editable={false} />
                    <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.price") as string} value={t(`subscription.price_type_${subscription.interval}`, { subscription_price: `${(subscription.price / 100).toFixed(2)}`}) as string} editable={false} />
                    {
                        // <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.coupon")} value={coupon} disabled={true} />
                    }
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => navigation.goBack()}>{t("commons.cancel")}</Button>
                    <Button mode='elevated' theme={{ colors: { elevation: { level1: colors.good_color } } }} loading={loading} onPress={() => openPaymentSheet()}>{t("subscription.checkout")}</Button>
                </Card.Actions>
            </Card>
        </SettingsContainer>
    )
}

export default SubscriptionValidationScreen;