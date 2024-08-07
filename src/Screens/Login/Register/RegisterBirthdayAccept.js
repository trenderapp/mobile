import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView, } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import dayjs from 'dayjs';

import styles from '../../../Style/style';
import Loader from '../../../Components/Loader';

import { useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { Logo } from '../../../Components/Elements/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DateInput } from '../../../Components/Elements/Input';
import { CaptchaBlock } from '../../../Other';
import { axiosInstance, cguLink, openURL } from '../../../Services';

const RegisterBirthdayAccept = ({ navigation, route }) => {

    const { t, i18n } = useTranslation('')
    const { colors } = useTheme();
    const { params } = route;
    const max_birthday = dayjs().subtract(13, "years").format("YYYY-MM-DD");
    const min_birthday = dayjs().subtract(100, "years").format("YYYY-MM-DD");

    const [error, setError] = useState({
        error: false,
        response: ""
    });
    const [loading, setLoading] = useState(false);

    const [captcha, setCaptcha] = useState(false);
    const [users, setUsers] = useState({
        ...params,
        birthday: dayjs().subtract(13, "years").subtract(1, 'day').toDate(),
        accept_tas: false
    });

    const handleSubmit = async () => {

        if (loading) return setError({ error: true, response: t(`errors.sending_form`) })

        if (!users.accept_tas || !users.birthday) return setError({ error: true, response: t(`errors.verify_fields`) });

        const birthday = users.birthday;

        if (dayjs(birthday).isBefore(min_birthday) || dayjs(birthday).isAfter(max_birthday)) return setError({ error: true, response: t(`errors.4`) });

        setCaptcha(true)
    };

    const onMessage = async (data) => {
        if (data === "cancel") return setCaptcha(false);

        setCaptcha(false)
        setLoading(true)

        const request = await axiosInstance.post("/register", {
            email: users.email.toLowerCase().trim(),
            username: users.username,
            password: users.password,
            affiliation_code: users?.affiliation_code,
            birthday: dayjs(users.birthday).format(),
            captcha_code: data
        })
        const response = request.data;

        if (response.error) {
            setLoading(false)
            return setError({ error: true, response: t(`errors.${response.error.code}`) })

        } else {

            setLoading(false)
            navigation.replace('RegisterVerification', {
                email: users.email
            });
        }
    }

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary
        }}>
            <Loader loading={loading} />
            <CaptchaBlock onMessage={onMessage} show={captcha} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Logo />
                        </View>
                        <View style={styles.SectionStyle}>
                            <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <DateInput onChange={(date) => setUsers({ ...users, birthday: date })} minimumDate={new Date(min_birthday)} value={users?.birthday}  label={t("login.birthday")} />
                            <View style={styles.row}>
                                <Checkbox.Android status={users.accept_tas ? "checked" : "unchecked"} onPress={() => setUsers({ ...users, accept_tas: !users.accept_tas })} />
                                <LinkButtonText text={t("login.t_and_s")} onPress={() => {
                                    setUsers({ ...users, accept_tas: !users.accept_tas })
                                    openURL(cguLink(i18n.language))
                                }} />
                            </View>
                        </View>
                        <NormalButton onPress={() => handleSubmit()} text={t("login.register")} />
                        <View style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: "space-between"
                            }}>
                                <LinkButtonText text={t("login.go_back")} onPress={() => navigation.goBack()} />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};
export default RegisterBirthdayAccept;