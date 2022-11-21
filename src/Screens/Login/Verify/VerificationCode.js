import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native";
import { useTheme } from "../../../Components/Container";
import { Button, Text } from "react-native-paper";

import styles from '../../../Style/style';
import { axiosInstance } from "../../../Services";
import { useClient } from "../../../Components/Container";

function VerificationCode({ navigation, route }) {

    const { t } = useTranslation('')
    const { colors } = useTheme();
    const [response, setResponse] = useState("...");
    const { state } = useClient();
    const { code } = route.params;

    useEffect(() => {
        
        async function getData() {
            const request = await axiosInstance.post(`/users/me/verify/email?code=${code}`)
            const response = await request.data;

            setResponse(response?.data?.success ? t("commons.success") : t(`errors.${response?.error?.code}`))
        }

        getData()

    }, [])

    const nextButton = () => {
        return response !== "..." && navigation.replace(`${state === "loged" ? "Bottom" : "LoginNavigator"}`)
    }


    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary,
            alignItems: 'center'
        }}>
            <Text>{t("login.register_verification_code", {
                response: response
            })}</Text>
            <Button onPress={() => nextButton()}>{t("commons.next")}</Button>
        </SafeAreaView>
    )
}

export default VerificationCode;