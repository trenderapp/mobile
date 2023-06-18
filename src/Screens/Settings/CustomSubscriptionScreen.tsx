import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList } from 'react-native';
import { Button, Card, TextInput, Text, Divider } from 'react-native-paper';

import SettingsContainer from '../../Components/Container/SettingsContainer';
import { useClient, useTheme } from '../../Components/Container';
import { Loader } from '../../Other';
import { getUserActiveSubscriptionInterface, getUserSubscriptionResponseInterface } from 'trender-client/Managers/Interfaces/CustomSubscription';
import { currencyType } from 'trender-client/Managers/Interfaces/Subscription';
import CustomSubscriptionCreateCard from '../../Components/Subscriptions/CustomCreateCard';

const convertToFloat = (inputValue: string) => {
    // Supprime les espaces vides en début et fin de chaîne
    const trimmedValue = inputValue.trim();

    // Vérifie si la chaîne est vide ou non
    if (trimmedValue === '') {
        return 0; // Valeur par défaut si la chaîne est vide
    }

    // Convertit la chaîne en nombre à virgule
    const floatValue = parseFloat(trimmedValue.replace(',', '.'));

    return isNaN(floatValue) ? 0 : floatValue;
};

function Customsubscriptioncreen() {

    const { t } = useTranslation();
    const { user, client } = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [subscription, setsubscription] = useState<getUserSubscriptionResponseInterface | undefined>(undefined)
    const [subscriptions, setSubscriptions] = useState<getUserActiveSubscriptionInterface[]>()
    const [inputPrice, setInputPrice] = useState('0');
    const [currency, setCurrency] = useState({
        symbol: "$",
        name: "usd"
    })

    const setActive = () => {
        if (!subscription) return;

        setsubscription({
            ...subscription,
            active: !subscription?.active
        })
    };

    const setPrice = (price: string) => {
        setInputPrice(price);
        if (!subscription) return;
        const convertedPrice = convertToFloat(price);
        setsubscription({
            ...subscription,
            price: convertedPrice
        });
    };

    const sendInformations = async () => {
        if (!subscription) return;
        setLoading(true)
        await client.subscription.custom.createAndUpdate({
            active: subscription.active,
            currency: currency.name as currencyType,
            price: parseInt((subscription.price * 100).toFixed(0))
        });

        Toast.show({ text1: t(`commons.success`) as string });
        return setLoading(false)

    }

    const getsubscription = async () => {
        const request = await client.subscription.custom.fetch(user.user_id);
        if (request.error || !request.data) return setsubscription({
            active: false,
            currency: 'usd',
            subscription_id: "",
            price: 0,
            user_id: user.user_id,
            user_price: 0
        });
        const response = request.data;

        setInputPrice((response.price / 100).toFixed(2))
        setsubscription({
            ...response,
            price: parseFloat((response.price / 100).toFixed(2))
        })
    }

    const getsubscriptions = async () => {
        const request = await client.subscription.custom.list();
        if (request.error || !request.data) return;
        const response = request.data;

        setSubscriptions(response)
    }

    useEffect(() => {
        getsubscription()
        getsubscriptions()
    }, [])

    return (
        <SettingsContainer title={t("settings.custom_subscription")}>
            {
                subscription ? <CustomSubscriptionCreateCard
                    subscription={subscription}
                    currency={currency}
                    inputPrice={inputPrice}
                    loading={loading}
                    sendInformations={sendInformations}
                    setActive={setActive}
                    setCurrency={setCurrency}
                    setPrice={setPrice}
                /> : <Loader />
            }
            <FlatList
                data={subscriptions}
                keyExtractor={(item) => item.subscription_info.subscription_id}
                ListEmptyComponent={<Text>You didn't subscribe to an account</Text>}
                renderItem={({ item }) => (
                    <Card style={{
                        backgroundColor: colors.bg_secondary,
                        margin: 5
                    }}>
                        <Card.Content>
                            <Text>{item.from.username}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button>{t("commons.cancel")}</Button>
                        </Card.Actions>
                    </Card>
                )}
            />
        </SettingsContainer>
    )
}

export default Customsubscriptioncreen;