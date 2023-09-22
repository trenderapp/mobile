import React from 'react';
import { Button, Card, TextInput, Text, Divider } from 'react-native-paper';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown'
import { getUserSubscriptionResponseInterface } from "trender-client/Managers/Interfaces/CustomSubscription";
import { navigationProps, subscriptionCurrencyArray, subscriptionCustomAllowedPrices } from "../../Services";
import { useClient, useTheme } from "../Container";
import { useTranslation } from 'react-i18next';


type sectionProps = {
    subscription: getUserSubscriptionResponseInterface;
    setCurrency: any;
    setPrice: any;
    inputPrice: string;
    setActive: any;
    currency: any;
    loading: boolean;
    sendInformations: any;
}

const CustomSubscriptionCreateCard = ({ subscription,setCurrency, setPrice, inputPrice, setActive, currency, loading, sendInformations }: sectionProps) => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const { client } = useClient();
    const navigation = useNavigation<navigationProps>();
    
    const openDashboard = async () => {
        const request = await client.subscription.custom.dashboard();
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
        navigation.navigate("WebViewScreen", {
            url: request.data?.url ?? ""
        });
    }

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <Button mode='contained-tonal' onPress={() => openDashboard()}>Dashboard</Button>
            <Card.Content>
                <Text>Create to my account :</Text>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <TextInput
                        style={{ marginBottom: 5, marginTop: 5, width: "85%" }}
                        mode='outlined'
                        label={`Between ${subscriptionCustomAllowedPrices.min} & ${subscriptionCustomAllowedPrices.max}`}
                        error={subscription.price < subscriptionCustomAllowedPrices.min || subscription.price > subscriptionCustomAllowedPrices.max}
                        value={inputPrice}
                        keyboardType='numeric'
                        right={<TextInput.Affix text={`${currency.symbol} /${t("subscription.month").toLocaleLowerCase()}`} />}
                        onChangeText={(txt) => setPrice(txt)}
                    />
                    <SelectDropdown
                        data={subscriptionCurrencyArray}
                        onSelect={(selectedItem) => setCurrency(selectedItem)}
                        defaultButtonText={currency.symbol}
                        buttonTextStyle={{ color: colors.text_normal }}
                        buttonTextAfterSelection={(selectedItem) => selectedItem.symbol}
                        buttonStyle={{
                            marginTop: 8,
                            marginRight: 2,
                            backgroundColor: colors.bg_primary,
                            borderColor: colors.fa_primary,
                            borderWidth: 1,
                            borderRadius: 5,
                            width: "15%",
                        }}
                        dropdownStyle={{
                            backgroundColor: colors.bg_primary,
                            borderColor: colors.fa_primary
                        }}
                        rowTextStyle={{
                            color: colors.text_normal
                        }}
                        rowTextForSelection={(item) => item.symbol}
                    />
                </View>
                <View style={{
                    width: "85%",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    padding: 8
                }}>
                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between"
                    }}>
                        <Text>You receive</Text>
                        <Text>{subscription.price} {currency.symbol}</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between"
                    }}>
                        <Text>Subscription fees</Text>
                        <Text>10 %</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        marginTop: 5
                    }}>
                        <Divider theme={{ colors: { outlineVariant: colors.fa_primary } }} bold />
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "space-between"
                        }}>
                            <Text>The user pay</Text>
                            <Text>{(subscription.price + subscription.price * 0.1).toFixed(2)} {currency.symbol}</Text>
                        </View>
                    </View>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button icon={subscription?.active ? "check" : "close"} onPress={() => setActive()}>{t(`commons.${subscription?.active ? "active" : "inactive"}`)}</Button>
                <Button
                    disabled={subscription.price < subscriptionCustomAllowedPrices.min || subscription.price > subscriptionCustomAllowedPrices.max}
                    mode='elevated'
                    theme={{ colors: { elevation: { level1: colors.good_color } } }}
                    loading={loading}
                    onPress={() => sendInformations()}>{t("commons.save")}</Button>
            </Card.Actions>
        </Card>
    )
}

export default CustomSubscriptionCreateCard;