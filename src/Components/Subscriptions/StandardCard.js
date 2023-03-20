import React from 'react';
import { Button, Text, Card, List } from 'react-native-paper';
import { useNavigation, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';

function StandardCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
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
            <Card.Actions>
                <Button>Subscribe</Button>
            </Card.Actions>
        </Card>
    )
}

export default StandardCard;