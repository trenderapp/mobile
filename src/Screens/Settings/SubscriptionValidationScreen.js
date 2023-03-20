import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Button, Text, Card } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from "@react-navigation/native";
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { axiosInstance } from '../../Services';
import { useClient } from '../../Components/Container';
import { useTranslation } from 'react-i18next';

function SubscriptionValidationScreen({ route }) {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation();
    const { user } = useClient();
    const [loading, setLoading] = useState(false)
    const { subscription_id } = route.params;

    const subscriptions = {
        "425691606356721665": {
            title: "Elite",
            sub_type: "Month",
            premium_type: 3,
            price: "9.99€"
        },
        "425691606373498882": {
            title: "Elite",
            sub_type: "Year",
            premium_type: 3,
            price: "99.99€"
        },
        "425691979834327044": {
            title: "Premium",
            sub_type: "Month",
            premium_type: 2,
            price: "5.99€"
        },
        "425691980887097349": {
            title: "Premium",
            sub_type: "Year",
            premium_type: 2,
            price: "59.99€"
        },
        "425692210537824263": {
            title: "Standard",
            sub_type: "Month",
            premium_type: 1,
            price: "2.99€"
        },
        "425692211489931272": {
            title: "Standard",
            sub_type: "Year",
            premium_type: 1,
            price: "29.99€"
        },
    }
    
    const fetchPaymentSheetParams = async (subscription_id = "425692211489931272") => {
        const request = await axiosInstance.post("/subscriptions", { subscription_id: subscription_id }, {
            headers: {
                "trendertokenapi": user.token
            }
        })

        const response = request.data;
        if(response.data) {
            const { paymentIntent, ephemeralKey, customer, publishableKey} = response.data;
            return { paymentIntent, ephemeralKey, customer, publishableKey };
        } else {
            return Toast.show({ text1: t(`errors.${response.error.code}`) });
        }
    };

    const initializePaymentSheet = async () => {
        const request = await fetchPaymentSheetParams(subscription_id);
        if(!request) return;
        const { paymentIntent, ephemeralKey, customer } = request;
    
        const { error } = await initPaymentSheet({
          merchantDisplayName: "Trender, Inc.",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: false,
          defaultBillingDetails: {
            name: user.username,
          }
        });

        if(error) return console.log(error);
      };

    const openPaymentSheet = async () => {
        setLoading(true)
        const { error } = await presentPaymentSheet();

        if (error) {
            Toast.show({ text1: `Error : ${error.message}` });
            setLoading(false)
        } else {
            Toast.show({ text1: `Success Your order is confirmed!` });
            navigation.replace("Bottom")
        }
    };

    useEffect(() => {
        if(!subscription_id) return;
        // initializePaymentSheet()
    }, [])


    return (
        <SettingsContainer title={t("settings.subscriptions_checkout")}>
            <Card>
            <Card.Content>
                <Text variant="titleLarge">{subscriptions[subscription_id].title} subscription</Text>
                <Text variant="titleMedium">{subscriptions[subscription_id].sub_type}</Text>
                <Text variant="bodyMedium">{subscriptions[subscription_id].price}</Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => navigation.goBack()}>{t("commons.cancel")}</Button>
                <Button loading={loading} onPress={() => openPaymentSheet()}>Checkout</Button>
            </Card.Actions>
        </Card>
        </SettingsContainer>
    )
}

export default SubscriptionValidationScreen;