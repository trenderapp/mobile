import React from 'react';
import { Button, Text, Card } from 'react-native-paper';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { useClient, useNavigation, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { full_width } from '../../Style/style';
import NormalCard from '../../Components/Subscriptions/NormalCard';
import StandardCard from '../../Components/Subscriptions/StandardCard';
import PremiumCard from '../../Components/Subscriptions/PremiumCard';
import EliteCard from '../../Components/Subscriptions/EliteCard';

function SubscriptionScreen() {

    const { t } = useTranslation();
    const { user } = useClient();
    const { colors } = useTheme();

    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            <ScrollView>
                <Card style={{
                    backgroundColor: colors.bg_secondary,
                    margin: 5
                }}>
                    <Card.Content>
                        <Text variant="titleLarge">Current subscription</Text>
                        <Text variant="bodyMedium">{user.premium_type === 0 ? "Free" : user.premium_type === 1 ? "Standard" : user.premium_type === 2 ? "Premium" : user.premium_type === 3 ? "Elite" : "Custom"}</Text>
                    </Card.Content>
                    {
                        user.premium_type !== 0 && (
                            <Card.Actions>
                                <Button>Cancel</Button>
                            </Card.Actions>
                        )
                    }
                </Card>
                <StandardCard />
                <EliteCard />
                <PremiumCard />
                <NormalCard />
            </ScrollView>
        </SettingsContainer>
    )
}

export default SubscriptionScreen;