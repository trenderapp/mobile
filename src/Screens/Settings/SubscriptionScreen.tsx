import React from 'react';
import { Button, Text, Card, List } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native';
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

    return (
        <SettingsContainer title={t("settings.subscriptions")}>
            <ScrollView>
                <EliteCard />
                <PremiumCard />
                <StandardCard />
                <NormalCard />
            </ScrollView>
        </SettingsContainer>
    )
}

export default SubscriptionScreen;