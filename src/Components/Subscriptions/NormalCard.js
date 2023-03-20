import React from 'react';
import { Button, Text, Card, List } from 'react-native-paper';
import { useNavigation, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';

function NormalCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Card.Content>
                <Text variant="titleLarge">Current subscription</Text>
                <Text variant="bodyMedium">Free</Text>
            </Card.Content>
            <Card.Content>
                <List.Item title="512 caracters allowed" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Maximum size of file to upload 25Mo" left={props => <List.Icon {...props} icon="adjust" />} />
                <List.Item title="Ads" left={props => <List.Icon {...props} icon="adjust" />} />
            </Card.Content>
            <Card.Actions>
                <Button>Subscribe</Button>
            </Card.Actions>
        </Card>
    )
}

export default NormalCard;