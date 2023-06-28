import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native"
import { Text, TextInput, Button } from "react-native-paper";
import { axiosInstance, navigationProps } from "../../Services";
import styles from '../../Style/style';
import { CustomHeader, useTheme } from "../../Components/Container";

function ChangePassword({ route }: any) {

    const { t } = useTranslation('')
    const { colors } = useTheme();
    const { code } = route.params;

    const [users, setUsers] = useState({
        password: "",
        password2: ""
    });
    const [error, setError] = useState({
        error: false,
        response: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(true);
    const navigation = useNavigation<navigationProps>()

    const handleSubmit = async () => {
        if (users.password !== users.password2) return setError({ error: true, response: t(`errors.different_password`) });
        if (users.password.length < 8) return setError({ error: true, response: t(`errors.password_security`) });

        setLoading(true)

        const request = await axiosInstance.post(`/users/me/recovery/password?code=${code}`, {
            password: users.password,
            password2: users.password2
        })

        const response = request.data;
        setLoading(false)

        if (response.error) {
            return setError({ error: true, response: t(`errors.${response.error.code}`) })
        } else {
            navigation.navigate("LoginNavigator", {
                screen: "Login"
            });
        }
    };

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary
        }}>
            <CustomHeader title="Change your Password" />
            <KeyboardAwareScrollView style={{ marginTop: 30 }} resetScrollToCoords={{ x: 0, y: 0 }}>
                <View>
                    <Text style={{ color: colors.warning_color, textAlign: "center", marginBottom: 10 }}>{error.error && error.response}</Text>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            label={`${t("login.password")}`}
                            autoCapitalize="none"
                            secureTextEntry={showPass}
                            right={<TextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off" } />}
                            value={users.password}
                            onChangeText={(text: string) => setUsers({
                                ...users,
                                password: text
                            })}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            label={`${t("login.repeat_password")}`}
                            autoCapitalize="none"
                            secureTextEntry={showPass}
                            right={<TextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off" } />}
                            value={users.password2}
                            onChangeText={(text: string) => setUsers({
                                ...users,
                                password2: text
                            })}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Button onPress={() => handleSubmit()} disabled={loading} mode="contained" loading={loading}>{t("commons.confirm")}</Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword;