import React, { useState } from 'react';
import { Button, Text, Card, List, Dialog, Portal, RadioButton, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useClient, useTheme, useNavigation } from '../../Components/Container';
import { axiosInstance } from '../../Services';

function StandardCard() {

    const { t } = useTranslation();
    const { user } = useClient();
    const { colors } = useTheme();
    const [subscriptionType, setSubscriptionType] = useState<"month" | "year">("year");
    const navigation = useNavigation()
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [coupon_id, setCouponID] = useState<string | undefined>()

    const hideDialog = () => setVisible(false);

    const openPaymentPage = async () => {
        if (loading) return;
        setLoading(true)
        const request = await axiosInstance.post("/subscriptions/checkout", {
            subscription_id: subscriptionType === "month" ? "425692210537824263" : "425692211489931272",
            coupon_id: coupon_id
        }, {
            headers: {
                "trendertokenapi": user.token
            }
        })

        const response = request.data;

        if (response.data) {
            hideDialog()
            setLoading(false)
            navigation?.push("SubscriptionValidationScreen", {
                url: response.data.url,
                subscription_id: subscriptionType === "month" ? "425692210537824263" : "425692211489931272"
            })

        } else {
            hideDialog()
            setLoading(false)
            Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        }
    }

    const openCheckOutPage = async () => {
        if (loading) return;
        setLoading(true)
        hideDialog()
        setLoading(false)
        navigation?.push("SubscriptionValidationScreen", {
            subscription_id: subscriptionType === "month" ? "425692210537824263" : "425692211489931272",
            coupon_id: coupon_id
        })
    }

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Portal>
                <Dialog visible={visible} onDismiss={loading ? undefined : hideDialog}>
                    <Dialog.Title>{t("subscription.make_your_choice")}</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Item
                            label={t("subscription.price_type_year", {
                                subscription_price: "29.99€",
                            })}
                            value='year'
                            status={subscriptionType === 'year' ? 'checked' : 'unchecked'}
                            onPress={() => setSubscriptionType('year')}
                        />
                        <RadioButton.Item
                            label={t("subscription.price_type_month", {
                                subscription_price: "2.99€",
                            })}
                            value='month'
                            status={subscriptionType === 'month' ? 'checked' : 'unchecked'}
                            onPress={() => setSubscriptionType('month')}
                        />
                        <TextInput mode='outlined' label={t("subscription.coupon") as string} value={coupon_id} onChangeText={(t) => setCouponID(t)} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        {loading ? false : <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>}
                        <Button uppercase={false} loading={loading} onPress={() => openCheckOutPage()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Card.Content>
                <Text variant="titleLarge">{t("subscription.subscription_type", { subscription_type: "Standard" })}</Text>
                <Text variant="bodyMedium">2.99€</Text>
            </Card.Content>
            <Card.Content>
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_1")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_2")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_3")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_4")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_5")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_6")} left={props => <List.Icon {...props} icon="adjust" />} />
                {
                    // <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.standard_7")} left={props => <List.Icon {...props} icon="adjust" />} />
                }
            </Card.Content>
            {
                user.premium_type === 1 ? (
                    <Card.Actions>
                        <Button>{t("subscription.current")}</Button>
                    </Card.Actions>
                ) : (
                    <Card.Actions>
                        <Button onPress={() => setVisible(true)}>{t("subscription.subscribe")}</Button>
                    </Card.Actions>
                )
            }
        </Card>
    )
}

export default StandardCard;