import React, { useContext, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Divider, Text, IconButton, Button, Tooltip, Portal, Modal } from "react-native-paper";
import { userFlags } from "trender-client";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import FastImage from "react-native-fast-image";
import { postResponseSchema } from "trender-client/Managers/Interfaces/Post";
import { useNavigation as useNativeNavigation } from "@react-navigation/native";

import styles, { full_height, full_width } from "../../Style/style";
import { UserBadges } from "../Member";
import { useClient, useNavigation, useTheme } from "../Container";
import { Markdown } from "../Elements/Text";
import DisplayPosts from "../Posts/DisplayPost";
import SvgElement from "../Elements/Svg";
import { addDmGroup, DmGroupListContext } from "../../Context/DmGuildListContext";
import ProfileUserModal from "./Edit/Modal/User";
import ProfileOwnerModal from "./Edit/Modal/Owner";
import { profileInformationsInterface } from "trender-client/Managers/Interfaces/User";
import { navigationProps, openURL, subscriptionCurrencyArray } from "../../Services";
import { getUserSubscriptionResponseInterface } from "trender-client/Managers/Interfaces/CustomSubscription";
import BadgeModal from "../../Other/BadgeModal";

type SectionProps = {
    nickname: string,
    pined: postResponseSchema,
    informations: profileInformationsInterface,
    setInfo: any;
    modalVisible: boolean;
    setModalVisible: any;
}

function ProfileComponent({ nickname, pined, informations, setInfo, setModalVisible, modalVisible }: SectionProps) {

    const { t, i18n } = useTranslation('');
    const { colors } = useTheme();
    const { client, user } = useClient();
    const naviteNavigation = useNativeNavigation<navigationProps>();
    const navigation = useNavigation();
    const { dispatch } = useContext(DmGroupListContext);
    const [visible, setVisible] = useState(false);
    const [badgeInfoVisible, setBadgeInfoVisible] = useState(false);
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

    const subscriptionPress = () => {
        hideModal()
        navigation.push("CustomSubscriptionValidationScreen", {
            subscription_id: informations.custom_subscription,
            informations: informations
        })
    }

    const SubscriptionModal = () => (
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
                    onPress={() => informations.pay_custom_subscription ? undefined : subscriptionPress()}>{t("subscription.subscribe")}</Button>
            </Modal>
        </Portal>
    )

    const ProfileHeader = () => (
        <View style={[styles.row, { justifyContent: "space-between", position: "absolute", zIndex: 99, width: full_width, backgroundColor: `${colors.bg_third}${0}` }]}>
            {naviteNavigation.canGoBack() && <IconButton mode="contained-tonal" icon="arrow-left" onPress={() => naviteNavigation.goBack()} />}
            
            <IconButton mode="contained-tonal" style={{ marginRight: 5 }} onPress={() => setModalVisible(true)} icon="dots-horizontal" />    
        </View>
    )

    const AllModals = () => (
        <>
            <SubscriptionModal />
            <BadgeModal badgeInfoVisible={badgeInfoVisible} setBadgeInfoVisible={() => setBadgeInfoVisible(false)} />
            {informations.user_id !== user?.user_id && <ProfileUserModal setInfo={setInfo} modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} />}
            {informations.user_id === user?.user_id && <ProfileOwnerModal modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} />}
        </>
    )

    const ProfileBanner = () => (
        <View style={{ height: 150 }}>
            
            {
                informations?.banner ? <FastImage style={[styles.banner_image, { backgroundColor: colors.bg_secondary }]} source={{ uri: `${client.user.banner(informations.user_id, informations.banner)}` }} /> : <View style={[styles.banner_image, { backgroundColor: informations.accent_color }]} />
            }
        </View>
    )

    const ProfilePictures = () => (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ paddingTop: 5 }}>
                <Text style={{ maxWidth: 250, marginTop: 10 }} variant="titleLarge">{informations.username}</Text>
                <Text style={{ color: colors.text_muted, marginBottom: 20 }}>@{nickname ?? "..."}</Text>
                <View style={styles.row}>
                    {client.user.flags(informations.flags.toString()).has(userFlags.TRENDER_EMPLOYEE) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("TRENDER_EMPLOYEE")} />}
                    {client.user.flags(informations.flags.toString()).has(userFlags.EARLY_SUPPORTER) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("EARLY_SUPPORTER")} />}
                    {client.user.flags(informations.flags.toString()).has(userFlags.TRENDER_PARTNER) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("TRENDER_PARTNER")} />}
                    {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_USER) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("SUB_1")} />}
                    {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_2_USER) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("SUB_2")} />}
                    {client.user.flags(informations.flags.toString()).has(userFlags.PREMIUM_3_USER) && <UserBadges size={24} onPress={() => setBadgeInfoVisible(true)} url={client.user.badge("SUB_3")} />}
                    {informations.is_private && <SvgElement onPress={() => setBadgeInfoVisible(true)} size={22} name="lock" color={colors.text_normal} />}
                    {informations.certified && <SvgElement onPress={() => setBadgeInfoVisible(true)} size={22} name="verified" color={colors.text_normal} />}
                </View>
            </View>
            <FastImage
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    borderColor: colors.bg_primary,
                    borderWidth: 3,
                    marginTop: -25,
                    backgroundColor: colors.bg_secondary
                }}
                source={{ uri: `${client.user.avatar(informations.user_id, informations.avatar)}` }} />
                
        </View>
    )

    const ProfileButtons = () => (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingRight: 5,
            marginLeft: -10
        }}>
            {informations.follow_back && <Tooltip title="Follow Back"><IconButton style={{ margin: 0 }} icon="account-sync" /></Tooltip>}
            {informations.user_id !== user?.user_id && informations.allow_dm && <IconButton style={{ margin: 0 }} onPress={() => createDM()} icon="email" />}
            {informations.user_id !== user?.user_id && informations.custom_subscription && (
                <IconButton style={{ margin: 0 }} iconColor={informations.pay_custom_subscription ? colors.good_color : undefined} onPress={() => {
                    getSubscriptions();
                    showModal();
                }} icon="account-cash" />
            )}

        </View>
    )

    return (
        <View style={{ borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <AllModals />
            <View>
                <ProfileHeader />
                <ProfileBanner />
                <View style={[{ paddingLeft: 15, paddingRight: 15 }]}>
                    <ProfilePictures />
                    <View style={{ marginLeft: 5, paddingBottom: 5 }}>   
                        <Markdown token={user.token} content={informations?.description ?? ""} />
                    </View>
                    <View style={{ marginLeft: 5, marginBottom: 20 }} >
                        {typeof informations.link === "string" && informations.link.trim().length > 0 ? <Button style={{ marginLeft: -5 }} contentStyle={{ justifyContent: "flex-start", marginLeft: -5 }} onPress={() => openURL(informations?.link ?? "")} icon="link-variant"><Text style={{ color: colors.text_link }}>{informations.link.length > 50 ? `${informations.link.substring(0, 45)}...` : informations.link}</Text></Button> : null}
                        <Text>{t("profile.joined")} : <Text  style={{ textTransform: "capitalize" }}>{dayjs(informations.created_at).locale(i18n.language).format("MMMM YYYY")}</Text></Text>

                        <ProfileButtons />
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                            <TouchableOpacity style={[styles.column, { alignItems: "center" }]} onPress={() => navigation.push('ProfileFollower', { type: "subscriptions", nickname: nickname })}>
                                <Text variant="bodyLarge" style={{ fontWeight: "900" }}>{informations.subscriptions}</Text>
                                <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>{t("profile.subscriptions")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.column, { alignItems: "center" }]} onPress={() => navigation.push('ProfileFollower', { type: "subscribers", nickname: nickname })}>
                                <Text variant="bodyLarge" style={{ fontWeight: "900" }}>{informations.subscribers}</Text>
                                <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>{t("profile.subscribers")}</Text>
                            </TouchableOpacity>
                            <View style={[styles.column, { alignItems: "center" }]}>
                                <Text variant="bodyMedium" style={{ textTransform: "capitalize", fontWeight: "900" }}>{informations.total_posts}</Text>
                                <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>Trends</Text>
                            </View>
                        </View>
                        {informations.user_id !== user?.user_id && <Button mode="contained" icon={informations.followed ? "account-heart" : "account"} onPress={() => informations.followed ? unfollow() : follow()} >{t(`profile.${informations.followed ? "unfollow" : "follow"}`)}</Button>}
                        { informations.user_id === user?.user_id && <Button onPress={() => navigation.push("ProfileEditScreen", { info: informations })} icon="account-edit" mode="contained">{t(`profile.edit`)}</Button> }
                    </View>
                </View>
            </View>
            <Divider bold horizontalInset />
            {pined && <DisplayPosts pined={true} informations={pined} />}
        </View>
    )
};

export default ProfileComponent;