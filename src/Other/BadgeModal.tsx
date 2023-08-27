import React from "react";
import { Divider, Text } from "react-native-paper";
import { View, ViewStyle } from "react-native";
import BottomModal from "./BottomModal";
import { useTranslation } from "react-i18next";
import { useClient, useTheme } from "../Components/Container";
import { UserBadges } from "../Components/Member";
import SvgElement from "../Components/Elements/Svg";
import styles, { full_width } from "../Style/style";

type SectionProps = {
    badgeInfoVisible: boolean;
    setBadgeInfoVisible: () => void;
}

export default function BadgeModal({ badgeInfoVisible, setBadgeInfoVisible }: SectionProps) {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client } = useClient();

    const style: ViewStyle[] = [
        styles.row, 
        {
            padding: 10,
            width: full_width 
        }
    ]

    return (
        <BottomModal onSwipeComplete={() => setBadgeInfoVisible()} dismiss={() => setBadgeInfoVisible()} isVisible={badgeInfoVisible}>
            <View style={style}><SvgElement padding={0} size={18} name="lock" color={colors.text_normal} /><Text>{t("badges.PRIVATE_USER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><SvgElement padding={0}  size={18} name="verified" color={colors.text_normal} /><Text>{t("badges.CERTIFIED_USER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("TRENDER_EMPLOYEE")} /><Text>{t("badges.TRENDER_EMPLOYEE")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("TRENDER_PARTNER")} /><Text>{t("badges.TRENDER_PARTNER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("EARLY_SUPPORTER")} /><Text>{t("badges.EARLY_SUPPORTER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("SUB_1")} /><Text>{t("badges.PREMIUM_USER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("SUB_2")} /><Text>{t("badges.PREMIUM_2_USER")}</Text></View>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <View style={style}><UserBadges url={client.user.badge("SUB_3")} /><Text>{t("badges.PREMIUM_3_USER")}</Text></View>
        </BottomModal>
    )
}