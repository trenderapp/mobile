import React, { useState } from 'react';
import { Button, Text, Card, List, Dialog, Portal, RadioButton } from 'react-native-paper';
import { useClient, useNavigation, useTheme } from '../Container';
import { useTranslation } from 'react-i18next';
import { SubscriptionInterface } from 'trender-client';

type sectionProps = {
    subs?: SubscriptionInterface.getSubscriptionsResponseInterface[]
}

function EliteCard({ subs }: sectionProps) {

    const { t } = useTranslation();
    const { user } = useClient();
    const { colors } = useTheme();
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionInterface.intervalType>("year");
    const navigation = useNavigation()
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const hideDialog = () => setVisible(false);

    const openCheckOutPage = async () => {
        if(!subs) return;
        const find_sub = subs.find(s => s.interval === subscriptionType);
        if(!find_sub) return;
        setLoading(true)
        hideDialog()
        setLoading(false)
        navigation?.push("SubscriptionValidationScreen", {
            title: t("subscription.elite"),
            subscription: find_sub
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
                        {
                            subs?.map((s, idx) => (
                                <RadioButton.Item
                                    key={idx}
                                    label={t(`subscription.price_type_${s.interval}`, {
                                        subscription_price: `${(s.price / 100).toFixed(2)}`,
                                    })}
                                    value={s.interval}
                                    status={subscriptionType === s.interval ? 'checked' : 'unchecked'}
                                    onPress={() => setSubscriptionType(s.interval)}
                                />
                            ))
                        }
                        {
                            // <TextInput mode='outlined' label={t("subscription.coupon") as string} value={coupon_id} onChangeText={(t) => setCouponID(t)} />
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        {loading ? false : <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>}
                        <Button uppercase={false} loading={loading} onPress={() => openCheckOutPage()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Card.Content>
                <Text variant="titleLarge">{t("subscription.subscription_type", { subscription_type: t("subscription.elite") })}</Text>
                { subs ? subs?.filter(s => s.interval === "month").map((s, idx) => <Text key={idx} variant="bodyMedium">{t(`subscription.price_type_${s.interval}`, { subscription_price: `${(s.price / 100).toFixed(2)}`})}</Text>) : null }
            </Card.Content>
            <Card.Content>
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_1")} left={props => <List.Icon {...props} icon="plus" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_2")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_3")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_4")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_5")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_6")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_7")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_8")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.elite_9")} left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
            {
                user.premium_type === 3 ? (
                    <Card.Actions>
                        <Button>{t("subscription.current")}</Button>
                    </Card.Actions>
                ) : (
                    <Card.Actions>
                        {subs && subs[0]?.active ? <Button onPress={() => setVisible(true)}>{t("subscription.subscribe")}</Button> : <Button>{t("subscription.coming_soon")}</Button>}
                    </Card.Actions>
                )
            }
        </Card>
    )
}

export default EliteCard;