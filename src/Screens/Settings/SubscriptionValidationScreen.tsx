import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Button } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { axiosInstance } from '../../Services';
import { useClient } from '../../Components/Container';
import { Loader } from '../../Other';
import { useTranslation } from 'react-i18next';

function SubscriptionValidationScreen() {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { user } = useClient();

    const fetchPaymentSheetParams = async (subscription_id: string = "420224753865981954") => {
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
            return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        }
    };

    const initializePaymentSheet = async () => {
        const request = await fetchPaymentSheetParams();
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
        const { error } = await presentPaymentSheet();

        if (error) {
            Toast.show({ text1: `Error : ${error.message}` });
        } else {
            Toast.show({ text1: `Success Your order is confirmed!` });
        }
    };

    useEffect(() => {
        initializePaymentSheet()
    }, [])


    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            <Button onPress={openPaymentSheet}>Checkout</Button>
        </SettingsContainer>
    )
}

export default SubscriptionValidationScreen;