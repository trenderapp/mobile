import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { TextInput as PaperTextInput, Text, Switch, Checkbox } from 'react-native-paper';
import dayjs from "dayjs";

import styles from '../../Style/style';

import Loader from '../../Components/Loader';
import { apibaseurl } from '../../Services/constante';
import { CaptchaBlock } from '../../Other';
import { useTheme } from '../../Components/Container';
import { LinkButtonText, NormalButton } from '../../Components/Elements/Buttons';
import { Logo } from '../../Components/Elements/Assets';
import { DateInput, TextInput } from '../../Components/Elements/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { cguLink, EmailValidator, openURL } from '../../Services';

const RegisterScreen = ({ navigation }) => {

  const { t, i18n } = useTranslation('')
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const [error, setError] = useState({
    error: false,
    response: ""
  });

  const [captcha, setCaptcha] = useState(false);
  const [users, setUsers] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    birthday: "",
    affiliation_code: undefined,
    accept_tas: false
  });

  const max_birthday = dayjs().subtract(13, "years").format("YYYY-MM-DD");
  const min_birthday = dayjs().subtract(120, "years").format("YYYY-MM-DD");

  const handleSubmit = async () => {
 
    const birthday = dayjs(users.birthday).format();

    if(loading) return setError({ error: true, response: t(`errors.sending_form`) })

    if(!users.accept_tas || !users.email || !users.username || !users.password || !users.birthday) return setError({ error: true, response: t(`errors.verify_fields`) });

    if(!EmailValidator(users.email) || users.username.length > 30 || users.username.length < 3 ) return setError({ error: true, response: t(`errors.verify_fields`) });

    if (users.password !== users.password2) return setError({ error: true, response: t(`errors.different_password`)});
    if(users.password.length < 8) return setError({ error: true, response: t(`errors.password_security`) });

    if (!dayjs(birthday).isBefore(max_birthday) || !dayjs(birthday).isAfter(min_birthday)) return setError({ error: true, response: t(`errors.4`) });

    setCaptcha(true)
  };

  const onMessage = async (data) => {
    if(data === "cancel") return setCaptcha(false);
    
    const requestOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        email: users.email.toLowerCase(),
        username: users.username,
        password: users.password,
        password2: users.password2,
        affiliation_code: users?.affiliation_code,
        birthday: dayjs(users.birthday).format(),
        code: data
      })
    };

    setCaptcha(false)
    setLoading(true)

    const request = await fetch(`${apibaseurl}/register`, requestOptions)
    const response = await request.json();

    if(response.error){
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
              <Text style={{ color: colors.warning_color }}>{error.error && error.response}</Text>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={`${t("login.email")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.email}
                onChangeText={(email) => setUsers({ ...users, email: email })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={`${t("login.username")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.username}
                onChangeText={(text) => setUsers({ ...users, username: text })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={`${t("login.password")}`}
                secureTextEntry={showPass}
                returnKeyType="next"
                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off" } color={colors.text_normal} />}
                value={users.password}
                onChangeText={(password) => setUsers({ ...users, password: password })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={`${t("login.repeat_password")}`}
                secureTextEntry={showPass}
                returnKeyType="next"
                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off" } color={colors.text_normal} />}
                value={users.password2}
                onChangeText={(password) => setUsers({ ...users, password2: password })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={`${t("login.affiliation_code")}`}
                autoCapitalize="none"
                returnKeyType="next"
                value={users?.affiliation_code ?? ""}
                onChangeText={(text) => setUsers({ ...users, affiliation_code: text })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <DateInput onChange={(date) => setUsers({ ...users, birthday: date })} minimumDate={new Date(min_birthday)} maximumDate={new Date(max_birthday)} text={t("login.birthday")} />
              <View style={styles.row}>
                <Checkbox.Android status={users.accept_tas ? "checked" : "unchecked"} onPress={() => setUsers({ ...users, accept_tas: !users.accept_tas })} />
                <LinkButtonText text={t("login.t_and_s")} onPress={() => {
                  setUsers({ ...users, accept_tas: !users.accept_tas })
                  openURL(cguLink(i18n.language))
                }} />
              </View>
            </View>
            <NormalButton onPress={handleSubmit} text={t("login.register")} />
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
              <LinkButtonText text={t("login.already_account")} onPress={() => navigation.replace("Login")} />
            </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RegisterScreen;