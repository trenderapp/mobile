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

dayjs.extend(relativeTime)

export default function Username({ user, created_at, lefComponent }) {

    const { colors } = useTheme();
    const flags = new UserPermissions(user?.flags);
    const { i18n } = useTranslation();

    return (
        <View>
            <View>
                <Text style={[{ maxWidth: "100%", overflow: "hidden" } ]}>{user?.username}{created_at && ` - ${dayjs(created_at).locale(i18n.language).fromNow(true).replace("une", "1").replace("un", "1")}`}</Text>
                <View style={styles.row}>
                    <Text style={[styles.text_muted, { color: colors.text_muted }]}>@{user?.nickname}</Text>
                    { user?.is_private && <SvgElement margin={5} size={15} name="lock" color={colors.text_normal} /> }
                    { flags.has(userFlags.VERIFIED_USER) && <SvgElement margin={5} name="verified" size={15} /> }
                    { lefComponent && lefComponent }
                </View>
            </View>
        </View>
    )
}