import React from 'react';
import { Button, Text, Card, List } from 'react-native-paper';
import { useNavigation, useTheme } from '../Container';
import { useTranslation } from 'react-i18next';

function EliteCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Card.Content>
                <Text variant="titleLarge">{t("subscription.subscription_type", { subscription_type: "Elite" })}</Text>
                <Text variant="bodyMedium">9.99€</Text>
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
            <Card.Actions>
                <Button>{t("subscription.coming_soon")}</Button>
            </Card.Actions>
        </Card>
    )
}

export default EliteCard;