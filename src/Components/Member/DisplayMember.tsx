import React from "react";

import { TouchableOpacity } from "react-native";
import styles from "../../Style/style";
import { Avatar } from "./";
import { useClient, useTheme } from "../Container";
import { Text } from "react-native-paper";
import SvgElement from "../Elements/Svg";
import UserPermissions from "trender-client/Permissions/UserPermissions";
import { userFlags } from "trender-client";

function DisplayMember({ informations, onPress, full_width }: any) {

    const { client } = useClient();
    const { colors } = useTheme();
    const flags = new UserPermissions(informations?.flags);

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress()}
            style={[
                styles.row,
                {
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 12,
                    padding: 10,
                    margin: 5,
                    width: full_width ? "100%" : undefined
                }
            ]}>
            { /** typeof index !== "undefined" ? <View style={{ backgroundColor: colors.bg_primary, borderRadius: 60, marginRight: 5, width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{`${index+1}`}</Text></View> : null */}
            <Avatar size={33} url={client.user.avatar(informations.user_id, informations.avatar)} />
            <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{informations.username}</Text>
            {informations.is_private && <SvgElement margin={-5} size={15} name="lock" color={colors.text_normal} />}
            {flags.has(userFlags.VERIFIED_USER) && <SvgElement name="verified" size={15} />}
        </TouchableOpacity>
    );
}

export default DisplayMember;