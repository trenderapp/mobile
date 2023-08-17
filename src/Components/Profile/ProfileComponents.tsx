import React, { useContext, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Divider, Text, IconButton, Button, Tooltip, Portal, Modal } from "react-native-paper";
import { userFlags } from "trender-client";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import FastImage from "react-native-fast-image";
import { postResponseSchema } from "trender-client/Managers/Interfaces/Post";

import styles, { full_height } from "../../Style/style";
import { UserBadges } from "../Member";
import { useClient, useNavigation, useTheme } from "../Container";
import { Markdown } from "../Elements/Text";
import DisplayPosts from "../Posts/DisplayPost";
import SvgElement from "../Elements/Svg";
import { addDmGroup, DmGroupListContext } from "../../Context/DmGuildListContext";
import ProfileUserModal from "./Edit/Modal/User";
import ProfileOwnerModal from "./Edit/Modal/Owner";
import { profileInformationsInterface } from "trender-client/Managers/Interfaces/User";
import { openURL, subscriptionCurrencyArray } from "../../Services";
import { getUserSubscriptionResponseInterface } from "trender-client/Managers/Interfaces/CustomSubscription";

type SectionProps = {
    nickname: string,
    pined: postResponseSchema,
    informations: profileInformationsInterface,
    setInfo: any
}

function ProfileComponent({ nickname, pined, informations, setInfo }: SectionProps) {

    const { t, i18n } = useTranslation('');
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation();
    const { dispatch } = useContext(DmGroupListContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [subscriptionPrice, setSubscriptionPrice] = useState<getUserSubscriptionResponseInterface>({
        active: true,
        currency: "eur",
        price: 0,
        subscription_id: "0000000",
        user_id: "0000000",
        user_price: 0
    })

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const follow = async () => {
        const response = await client.user.follow.create(informations.user_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...informations, followed: true })
        Toast.show({ text1: t("commons.success") as string })
    }

    const unfollow = async () => {
        const response = await client.user.follow.delete(informations.user_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...informations, followed: false })
        Toast.show({ text1: t("commons.success") as string })
    }

    const createDM = async () => {
        const response = await client.guild.create([informations.user_id]);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        dispatch(addDmGroup([response.data]));

        setTimeout(() => {
            navigation.replace("MessagesStack", {
                screen: "MessageScreen",
                params: response.data
            })
        }, 500)
    }
    
    const getSubscriptions = async () => {
        const response = await client.subscription.custom.fetch(informations.user_id);        
        if (response.error || !response.data) return;
        return setSubscriptionPrice({
            ...response.data,
            price: parseFloat((response.data.user_price / 100).toFixed(2))
        })
    }

    return (
        <View style={{ borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{
                    backgroundColor: colors.bg_primary,
                    padding: 20,
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    height: full_height / 2
                }}>
                    <Text>{t("profile.support_creator")} : <Text style={{ fontWeight: "bold" }}>{`${subscriptionPrice.price}${subscriptionCurrencyArray.find(f => f.name)?.symbol ?? "$"} /month`}</Text></Text>
                    <Button
                        loading={subscriptionPrice.price <= 0}
                        disabled={subscriptionPrice.price <= 0}
                        mode="contained"
                        onPress={() => informations.pay_custom_subscription ? undefined : navigation.push("CustomSubscriptionValidationScreen", {
                            subscription_id: informations.custom_subscription,
                            informations: informations
                        })}>{t("subscription.subscribe")}</Button>
                </Modal>
            </Portal>
            {informations.user_id !== user?.user_id && <ProfileUserModal setInfo={setInfo} modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} />}
            {informations.user_id === user?.user_id && <ProfileOwnerModal modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} />}
            <View>
                <View style={{ height: 100 }}>
                    {
                        informations?.banner ? <FastImage style={[
                            styles.banner_image, { backgroundColor: colors.bg_secondary }
                        ]} source={{ uri: `${client.user.banner(informations.user_id, informations.banner)}` }} /> : <View style={[styles.banner_image, { backgroundColor: informations.accent_color }]} />
                    }
                </View>
                <View style={[{ padding: 5 }]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <FastImage style={[styles.pdp64, { marginTop: -30, backgroundColor: colors.bg_secondary }]} source={{
                            uri: `${client.user.avatar(informations.user_id, informations.avatar)}`
                        }} />
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            {informations.follow_back && <Tooltip title="Follow Back"><IconButton style={{ margin: 0 }} icon="account-sync" /></Tooltip>}
                            <IconButton style={{ margin: 0 }} onPress={() => setModalVisible(true)} icon="dots-horizontal" />
                            {informations.user_id !== user?.user_id && informations.allow_dm && <IconButton style={{ margin: 0 }} onPress={() => createDM()} icon="email" />}
                            {informations.user_id !== user?.user_id && informations.custom_subscription && (
                                <IconButton style={{ margin: 0 }} iconColor={informations.pay_custom_subscription ? colors.good_color : undefined} onPress={() => {
                                    getSubscriptions();
                                    showModal();
                                }} icon="account-cash" />
                            )}
                            {informations.user_id === user?.user_id && <Button mode="contained-tonal" onPress={() => navigation.push("ProfileEditScreen", { info: informations })}>{t("profile.edit")}</Button>}
                            {informations.user_id !== user?.user_id && <Button mode="contained-tonal" onPress={() => informations.followed ? unfollow() : follow()}>{t(`profile.${informations.followed ? "unfollow" : "follow"}`)}</Button>}
                        </View>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Text>{informations.username}</Text>
                        <View style={styles.row}>
                            {informations.is_private && <SvgElement size={18} name="lock" color={colors.text_normal} />}
                            {informations.certified && <SvgElement size={18} name="verified" color={colors.text_normal} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.TRENDER_EMPLOYEE) && <UserBadges url={client.user.badge("TRENDER_EMPLOYEE")} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.EARLY_SUPPORTER) && <UserBadges url={client.user.badge("EARLY_SUPPORTER")} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.TRENDER_PARTNER) && <UserBadges url={client.user.badge("TRENDER_PARTNER")} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_USER) && <UserBadges url={client.user.badge("SUB_1")} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_2_USER) && <UserBadges url={client.user.badge("SUB_2")} />}
                            {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_3_USER) && <UserBadges url={client.user.badge("SUB_3")} />}
                        </View>
                        <View style={styles.row}>
                            <Text>@{informations.nickname}</Text>
                        </View>
                    </View>
                    <Markdown token={user.token} content={informations?.description ?? ""} />
                    <View >
                        {typeof informations.link === "string" ? <Button style={{ marginLeft: -5 }} contentStyle={{ justifyContent: "flex-start", marginLeft: -5 }} onPress={() => openURL(informations?.link ?? "")} icon="link-variant"><Text style={{ color: colors.text_link }}>{informations.link.length > 50 ? `${informations.link.substring(0, 45)}...` : informations.link}</Text></Button> : null}
                        <Text>{t("profile.joined")} : {dayjs(informations.created_at).locale(i18n.language).format("MMMM YYYY")}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.push('ProfileFollower', {
                                        type: "subscriptions",
                                        nickname: nickname
                                    })
                                }}>
                                    <Text style={{ marginRight: 5 }}><Text style={{ fontWeight: "900" }}>{informations.subscriptions}</Text> {t("profile.subscriptions").toLocaleLowerCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigation.push('ProfileFollower', {
                                        type: "subscribers",
                                        nickname: nickname
                                    })
                                }}>
                                    <Text><Text style={{ fontWeight: "900" }}>{informations.subscribers}</Text> {t("profile.subscribers").toLocaleLowerCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Divider bold horizontalInset />
            {pined && <DisplayPosts pined={true} informations={pined} />}
        </View>
    )
};

export default ProfileComponent;