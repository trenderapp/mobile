import React from 'react';
import { Text, Card, List } from 'react-native-paper';
import { useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';

function NormalCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Card.Content>
                <Text variant="titleLarge">{t("subscription.free_title")}</Text>
                <Text variant="bodyMedium">0.00€</Text>
            </Card.Content>
            <Card.Content>
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.free_1")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.free_2")} left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item titleStyle={{ fontSize: 14 }} title={t("subscription.free_3")} left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
        </Card>
    )
}

export default NormalCard;