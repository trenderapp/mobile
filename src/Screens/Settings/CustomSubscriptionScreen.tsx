import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import { getUserActiveSubscriptionInterface, getUserSubscriptionResponseInterface } from 'trender-client/Managers/Interfaces/CustomSubscription';
import { currencyType } from 'trender-client/Managers/Interfaces/Subscription';
import dayjs from 'dayjs';

import SettingsContainer from '../../Components/Container/SettingsContainer';
import { useClient, useTheme } from '../../Components/Container';
import { Loader } from '../../Other';
import CustomSubscriptionCreateCard from '../../Components/Subscriptions/CustomCreateCard';
import { messageFormatDate, navigationProps, subscriptionCurrencyArray } from '../../Services';
import { UserInfo } from '../../Components/Member';

const convertToFloat = (inputValue: string) => {
    // Supprime les espaces vides en début et fin de chaîne
    const trimmedValue = inputValue.trim();

    // Vérifie si la chaîne est vide ou non
    if (trimmedValue === '') {
        return 3; // Valeur par défaut si la chaîne est vide
    }

    // Convertit la chaîne en nombre à virgule
    const floatValue = parseFloat(trimmedValue.replace(',', '.'));
    
    return isNaN(floatValue) ? 3 : floatValue;
};

function Customsubscriptioncreen() {

    const { t } = useTranslation();
    const { user, client } = useClient();
    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [loadingActivation, setLoadingActivation] = useState<boolean>(false);
    const [subscription, setsubscription] = useState<getUserSubscriptionResponseInterface | undefined>(undefined)
    const [subscriptions, setSubscriptions] = useState<getUserActiveSubscriptionInterface[]>()
    const [inputPrice, setInputPrice] = useState('3');
    const [currency, setCurrency] = useState({
        symbol: "$",
        name: "usd"
    })
    const [active, setCustomActive] = useState<boolean>(false);

    const hideDialog = () => setVisible(false);

    const linkConnectAccount = async () => {
        setLoadingActivation(true)
        const request = await client.subscription.custom.register();
        if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
        setLoadingActivation(false)
        navigation.navigate("WebViewScreen", {
            url: request?.data?.url ?? ""
        });
    }

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
            user_price: convertedPrice
        });
    };

    const sendInformations = async () => {
        if (!subscription) return;
        setLoading(true)
        
        const request = await client.subscription.custom.createAndUpdate({
            active: subscription.active,
            currency: currency.name as currencyType,
            price: parseInt(((subscription?.user_price ?? 3) * 100).toFixed(0))
        });

        setLoading(false)
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
        Toast.show({ text1: t(`commons.success`) as string });
        return;
    }

    const getsubscription = async () => {
        const request_active = await client.subscription.custom.isActive();
        if (request_active.data?.active) setCustomActive(request_active.data.active);
        if (!request_active.data?.active) return;

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
        
        setCurrency({
            name: response?.currency ?? "usd",
            symbol: subscriptionCurrencyArray.find(c => c.name === response.currency)?.symbol ?? "$"
        })

        setInputPrice(((response?.user_price ?? 300) / 100).toFixed(2))
        setsubscription({
            ...response,
            active: response?.active ?? false,
            price: parseFloat(((response?.user_price ?? 300) / 100).toFixed(2))
        })
    }

    const getsubscriptions = async () => {
        const request = await client.subscription.custom.list();
        if (request.error || !request.data) return;
        const response = request.data;        
        setSubscriptions(response);
    }

    const cancelSubscription = async (target_id: string) => {
        await client.subscription.custom.cancel(target_id);
        Toast.show({ text1: t(`commons.success`) as string });
        await getsubscriptions()
        hideDialog();
    }

    useEffect(() => {
        getsubscription()
        getsubscriptions()
    }, [])

    const ConfirmCancelSubscription = ({ item }: { item: getUserActiveSubscriptionInterface }) => (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{t("settings.cancel_subscription")}</Dialog.Title>
                <Dialog.Actions>
                    <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                    <Button uppercase={false} loading={loading} onPress={() => cancelSubscription(item.subscription_info.subscription_id)}>{t("commons.continue")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )

    return (
        <SettingsContainer title={t("settings.custom_subscriptions")}>
            {
                !active ? <Button loading={loadingActivation} focusable={!loadingActivation} onPress={() => linkConnectAccount()} mode='contained-tonal'>{t("subscription.custom_activate")}</Button> : subscription ? <CustomSubscriptionCreateCard
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
                ListEmptyComponent={<Text>{t("subscription.no_subscriptions")}</Text>}
                ListHeaderComponent={<Text variant='titleMedium'>{t("subscription.my_subscriptions")}</Text>}
                renderItem={({ item }) => (
                    <Card style={{
                        backgroundColor: colors.bg_secondary,
                        margin: 5
                    }}>
                        <ConfirmCancelSubscription item={item} />
                        <Card.Content>
                            <UserInfo informations={item.from} onPress={undefined} full_width={undefined} noDescription={true} LeftComponent={undefined} />
                            <Text>{t("subscription.next_renew")} : {item.active ? messageFormatDate(dayjs(item.next_renew).format()).fullDate() : "-"}</Text>
                            <Text>{t("subscription.price")} : {(item.subscription_info.user_price / 100).toFixed(2)} {subscriptionCurrencyArray.find(s => s.name === item.subscription_info.currency)?.symbol} /month</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='elevated' theme={{ colors: { elevation: { level1: item.active ? colors.warning_color : undefined } } }} onPress={() => item.active ? setVisible(true) : undefined}>{item.active ? t("commons.cancel") : t("commons.canceled")}</Button>
                        </Card.Actions>
                    </Card>
                )}
            />
        </SettingsContainer>
    )
}

export default Customsubscriptioncreen;