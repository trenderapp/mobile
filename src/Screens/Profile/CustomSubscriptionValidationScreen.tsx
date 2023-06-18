import React, { useState, useEffect } from "react";
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useStripe } from '@stripe/stripe-react-native';
import { Text,Card, TextInput, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { profileInformationsInterface } from "trender-client/Managers/Interfaces/User";
import { SettingsContainer, useClient, useTheme } from "../../Components/Container";
import { axiosInstance, navigationProps, subscriptionCurrencyArray } from "../../Services";
import { Avatar } from "../../Components/Member";

export default function CustomSubscriptionValidationScreen({ route }: any) {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { client, token } = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [price, setPrice] = useState<number>(0)
    const navigation = useNavigation<navigationProps>();
    const { subscription_id, informations }: { subscription_id: string, informations: profileInformationsInterface } = route.params;

    const fetchPaymentSheetParams = async (subscription_id: string) => {
        const request = await axiosInstance.post(`/subscriptions/custom/${subscription_id}`, {}, {
            headers: {
                "trendertokenapi": token
            }
        })

        const response = request.data;
        
        if (response.data) {
            const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;
            return { paymentIntent, ephemeralKey, customer, publishableKey };
        } else {
            Toast.show({ text1: t(`errors.${response.error.code}`) as string });
            return;
        }
    };

    const initializePaymentSheet = async (subscription_id: string) => {
        const request = await fetchPaymentSheetParams(subscription_id);
        if (!request) return;
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
            Toast.show({ text1: `Success Your order is confirmed!` });
            navigation.goBack()
        }
    };

    const getSubscriptions = async () => {
        const response = await client.subscription.custom.fetch(informations.user_id);
        if (response.error || !response.data) return;
        setPrice(parseFloat((response.data.user_price / 100).toFixed(2)))
    }

    useEffect(() => {
        getSubscriptions()
        initializePaymentSheet(subscription_id)
    }, [subscription_id])


    return (
        <SettingsContainer title={t("settings.subscriptions_checkout")}>
            <Card>
                <Card.Content>
                    <View style={{ marginBottom: 5, flexDirection: "row", alignItems: "center" }}>
                        <Avatar url={client.user.avatar(informations.user_id, informations.avatar)} />
                        <Text>{informations.username}</Text>
                    </View>
                    <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.subscription") as string} value={price.toString()} right={<TextInput.Affix text={`${subscriptionCurrencyArray.find(f => f.name)?.symbol ?? "$"} /month`} />} editable={false} />
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => navigation.goBack()}>{t("commons.cancel")}</Button>
                    <Button mode='elevated' theme={{ colors: { elevation: { level1: colors.good_color } } }} loading={loading} onPress={() => openPaymentSheet()}>{t("subscription.checkout")}</Button>
                </Card.Actions>
            </Card>
        </SettingsContainer>
    )
}