import React, { useState } from 'react';
import { Button, Text, Card, List, Dialog, Portal, RadioButton, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useClient, useTheme, useNavigation } from '../../Components/Container';
import { axiosInstance, openURL } from '../../Services';

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
        if(loading) return;
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

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Portal>
                <Dialog visible={visible} onDismiss={loading ? undefined : hideDialog}>
                    <Dialog.Title>Make your choice</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Item
                            label="Year 29,99€"
                            value='year'
                            status={subscriptionType === 'year' ? 'checked' : 'unchecked'}
                            onPress={() => setSubscriptionType('year')}
                        />
                        <RadioButton.Item
                            label="Month 2,99€"
                            value='month'
                            status={subscriptionType === 'month' ? 'checked' : 'unchecked'}
                            onPress={() => setSubscriptionType('month')}
                        />
                        <TextInput mode='outlined' label="Promotion code" value={coupon_id} onChangeText={(t) => setCouponID(t.toLocaleUpperCase())} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        {loading ? false : <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>}
                        <Button uppercase={false} loading={loading} onPress={() => openPaymentPage()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Card.Content>
                <Text variant="titleLarge">Standard subscription</Text>
                <Text variant="bodyMedium">2.99€</Text>
            </Card.Content>
            <Card.Content>
                <List.Item title="1024 caracters allowed" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Upload files to a maximum of 50Mo" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Annual acccount summary" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Animated avatar and banner" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="NFT avatar and banner (coming soon)" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Show post views" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="No ads" left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
            {
                user.premium_type === 1 ? (
                    <Card.Actions>
                        <Button>Current</Button>
                    </Card.Actions>
                ) : (
                    <Card.Actions>
                        <Button onPress={() => setVisible(true)}>Subscribe</Button>
                    </Card.Actions>
                )
            }
        </Card>
    )
}

export default StandardCard;