import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Button, Text, Card, TextInput } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { axiosInstance, subscriptionsList } from '../../Services';
import { useClient, SettingsContainer, useNavigation as useAppNavigation } from '../../Components/Container';

function SubscriptionValidationScreen({ route }) {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation();
    const appNavigation = useAppNavigation();
    const client = useClient();
    const [loading, setLoading] = useState(true)
    const { subscription_id, coupon_id } = route.params;
    
    const fetchPaymentSheetParams = async (subscription_id = "425692210537824263", coupon_id) => {
        const request = await axiosInstance.post("/subscriptions/checkout", { subscription_id: subscription_id, coupon_id: coupon_id }, {
            headers: {
                "trendertokenapi": client.user.token
            }
        })

        const response = request.data;
        if(response.data) {
            if(response.data.url) {
                appNavigation?.replace("SubscriptionDashboardScreen", {
                    url: response.data.url
                })
                setLoading(false)
                return;
            } else {
                const { paymentIntent, ephemeralKey, customer, publishableKey} = response.data;
                return { paymentIntent, ephemeralKey, customer, publishableKey };
            }
        } else {
            Toast.show({ text1: t(`errors.${response.error.code}`) })
            return;
        }
    };

    const initializePaymentSheet = async () => {
        const request = await fetchPaymentSheetParams(subscription_id, coupon_id);
        if(!request) return;
        const { paymentIntent, ephemeralKey, customer } = request;
    
        const { error } = await initPaymentSheet({
          merchantDisplayName: "Trender, Inc.",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: false,
        });
        setLoading(false)
        if(error) return console.log(error);
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
                    premium_type: subscriptionsList[subscription_id].premium_type
                }
            })
            Toast.show({ text1: `Success Your order is confirmed!` });
            setTimeout(() => {
                navigation.replace("Bottom")
            }, 500)
        }
    };

    useEffect(() => {
        if(!subscription_id) return;
        initializePaymentSheet()
    }, [subscription_id])


    return (
        <SettingsContainer title={t("settings.subscriptions_checkout")}>
            <Card>
            <Card.Content>
                <Text variant="titleLarge">{t("subscription.subscription_type", { subscription_type: subscriptionsList[subscription_id].title })}</Text>
                <Text variant="titleMedium">{t(`subscription.${subscriptionsList[subscription_id].sub_type}`)}</Text>
                <Text variant="bodyMedium">{subscriptionsList[subscription_id].price}</Text>
                <TextInput mode='outlined' label={t("subscription.coupon")} value={coupon_id} editable={false} />
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => navigation.goBack()}>{t("commons.cancel")}</Button>
                <Button loading={loading} onPress={() => openPaymentSheet()}>{t("subscription.checkout")}</Button>
            </Card.Actions>
        </Card>
        </SettingsContainer>
    )
}

export default SubscriptionValidationScreen;