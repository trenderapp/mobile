import React, { useState } from 'react';
import { Button, Text, Card, List, Dialog, Portal, RadioButton } from 'react-native-paper';
import { useNavigation, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';

function StandardCard() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [subscriptionType, setSubscriptionType] = useState<"month" | "year">("year");
    const [visible, setVisible] = useState<boolean>(false);

    const hideDialog = () => setVisible(false);

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
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
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                        <Button uppercase={false} onPress={() => {
                            hideDialog()
                            return navigation?.push("SubscriptionValidationScreen", {
                                subscription_type: subscriptionType,
                                subscription_id: subscriptionType === "month" ? "425692210537824263" : "425692211489931272"
                            })
                        }}>{t("commons.continue")}</Button>
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
            <Card.Actions>
                <Button onPress={() => setVisible(true)}>Subscribe</Button>
            </Card.Actions>
        </Card>
    )
}

export default StandardCard;