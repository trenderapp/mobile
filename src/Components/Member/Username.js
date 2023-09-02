import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { userFlags } from "trender-client";
import UserPermissions from "trender-client/Permissions/UserPermissions";
import dayjs from "dayjs";
import styles from "../../Style/style";
import { useTheme } from "../Container";
import SvgElement from "../Elements/Svg";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from "react-i18next";
import { messageFormatDate } from "../../Services";

dayjs.extend(relativeTime)

export default function Username({ user, created_at, lefComponent }) {

    const { colors } = useTheme();
    const flags = new UserPermissions(user?.flags);
    const { i18n } = useTranslation();

    return (
        <View>
            <View>
                <View style={styles.row}>
                    <Text style={[{ maxWidth: "100%", overflow: "hidden" } ]}>{user?.username}</Text>
                    { user?.is_private && <SvgElement margin={-5} size={15} name="lock" color={colors.text_normal} /> }
                    { flags.has(userFlags.VERIFIED_USER) && <SvgElement name="verified" size={15} /> }
                </View>
                <View style={styles.row}>
                    <Text style={[styles.text_muted, { color: colors.text_muted }]}>{created_at && `${messageFormatDate(created_at).fullDate() /*dayjs(created_at).locale(i18n.language).fromNow(true).replace("une", "1").replace("un", "1")*/}`}</Text>
                    { lefComponent && lefComponent }
                </View>
            </View>
        </View>
    )
}