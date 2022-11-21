import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from 'react-i18next'

import styles, { bg_secondary }from "../../../Style/style";
import { Text } from "react-native-paper";

function ProfileNotFound({ error, nickname }){

    const { t } = useTranslation('');
    const [info, setInfo] = useState(null);
    
    useEffect(() => {
        setInfo(error.code)
    }, [error])

    return (
        <View style={{ borderBottomColor: bg_secondary, borderBottomWidth: 1 }}>
        {
            info && <View>
                <View style={{ height: 100 }}>
                    <View style={[styles.banner_image, { backgroundColor: bg_secondary }]} />
                </View> 
                <View style={[{ padding: 5 }]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={[styles.pdp64, { marginTop: -30, backgroundColor: bg_secondary }]} />
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={styles.text_muted}>@{nickname}</Text>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Text >{t(`errors.${info}`)}</Text>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginRight: 5 }}><Text style={{ fontWeight: "900" }}>0</Text> {t("profile.subscriptions")}</Text>
                            <Text><Text style={{ fontWeight: "900" }}>0</Text> {t("profile.subscribers")}</Text>
                        </View>
                    </View>
                </View>
            </View>
        }
        </View>
    )
};

export default ProfileNotFound;