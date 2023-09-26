import React, { useState, useEffect } from 'react';
import { Button, Card, TextInput, Text, Divider } from 'react-native-paper';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown'
import { getUserSubscriptionResponseInterface } from "trender-client/Managers/Interfaces/CustomSubscription";
import { useTranslation } from 'react-i18next';
import { PieChart } from "react-native-chart-kit";
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { navigationProps, subscriptionCurrencyArray, subscriptionCustomAllowedPrices } from "../../Services";
import { useClient, useTheme } from "../Container";
import { full_width } from '../../Style/style';
import { BottomModal } from '../../Other';


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

const CustomSubscriptionCreateCard = ({ subscription, setCurrency, setPrice, inputPrice, setActive, currency, loading, sendInformations }: sectionProps) => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const { client } = useClient();
    const [visible, setVisible] = useState<boolean>(false);
    const [fees, setFees] = useState({
        creator: 0,
        stripe: 0,
        trender: 0,
        final_price: 0
    });

    const navigation = useNavigation<navigationProps>();

    const hideDialog = () => setVisible(false);

    const openDashboard = async () => {
        const request = await client.subscription.custom.dashboard();
        if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
        navigation.navigate("WebViewScreen", {
            url: request.data?.url ?? ""
        });
    }

    useEffect(() => {       
        const price = subscription.price;
        const stripe_fees = price*0.03+0.25;
        const trender_fees = price < 10 ? 0.12+(price*0.03) : price*0.1;
        const final_fees = price < 10 ? stripe_fees+trender_fees : trender_fees;
        const final_price = price - final_fees;
            
        setFees({
            creator: parseFloat(final_price.toFixed(2)),
            stripe: parseFloat(stripe_fees.toFixed(2)),
            trender: parseFloat(trender_fees.toFixed(2)),
            final_price: parseFloat(final_price.toFixed(2))
        })
    }, [subscription])

    const SubscriptionFees = () => {
        const data = [
            {
                name: t("subscription.for_you"),
                price: fees.creator,
                color: colors.good_color,
                legendFontColor: colors.text_normal,
                legendFontSize: 15
            },
            {
                name: "Stripe",
                price: subscription.price < 10 ? fees.stripe : 0,
                color: "#625AFA",
                legendFontColor: colors.text_normal,
                legendFontSize: 15
            },
            {
                name: "Trender",
                price: fees.trender,
                color: "#FF7EEE",
                legendFontColor: colors.text_normal,
                legendFontSize: 15
            }
        ];

        const chartConfig: AbstractChartConfig = {
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        };

        return (
            <BottomModal onSwipeComplete={hideDialog} dismiss={hideDialog} isVisible={visible}>
                <Text variant='titleMedium'>{t("settings.fees_charged")}</Text>
                <PieChart
                    data={data}
                    width={full_width}
                    height={200}
                    chartConfig={chartConfig}
                    accessor={"price"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[0, 0]}
                />
                <View style={{
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
                        <Text>{t("subscription.the_user_pay")}</Text>
                        <Text>{subscription.price} {currency.symbol}</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between"
                    }}>
                        <Text>{t("subscription.fees")}</Text>
                        <Text>{(100-(fees.final_price/subscription.price)*100).toFixed(2)} %</Text>
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
                            <Text>{t("subscription.you_receive")}</Text>
                            <Text>{fees.final_price} {currency.symbol}</Text>
                        </View>
                    </View>
                </View>
            </BottomModal>
        )
    }

    return (
        <Card style={{
            backgroundColor: colors.bg_secondary,
            margin: 5
        }}>
            <SubscriptionFees />
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
                <Button mode='contained' onPress={() => setVisible(true)}>{t("settings.fees_charged")}</Button>
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