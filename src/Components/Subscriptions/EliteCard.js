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
                <Text variant="titleLarge">Elite subscription</Text>
                <Text variant="bodyMedium">9.99€</Text>
            </Card.Content>
            <Card.Content>
                <List.Item title="Premium and Standard advantages" left={props => <List.Icon {...props} icon="plus" />} />
                <List.Item title="4096 caracters" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="200Mo to upload" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Advanced statistics" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="AI copyright protection" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Upgrade trust factor" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Peer to Peer private message" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Creator advantages" left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
            <Card.Actions>
                <Button>Comming soon</Button>
            </Card.Actions>
        </Card>
    )
}

export default EliteCard;