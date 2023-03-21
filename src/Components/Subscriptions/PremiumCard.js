import React from 'react';
import { Button, Text, Card, List } from 'react-native-paper';
import { useNavigation, useTheme } from '../Container';
import { useTranslation } from 'react-i18next';

function PremiumCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Card.Content>
                <Text variant="titleLarge">Premium subscription</Text>
                <Text variant="bodyMedium">5.99€</Text>
            </Card.Content>
            <Card.Content>
                <List.Item title="Standard advantages" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="2048 caracters" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="100Mo to upload" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="No withdrawal fees" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Partner project advantages" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Show post views" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="No ads" left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
            <Card.Actions>
                <Button>Comming soon</Button>
            </Card.Actions>
        </Card>
    )
}

export default PremiumCard;