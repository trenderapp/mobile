import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import Client from "trender-client";
import { View, ScrollView, SafeAreaView } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Loader from '../../Components/Loader';
import styles from '../../Style/style';
import { apibaseurl } from '../../Services/constante';
import { CaptchaBlock } from '../../Other';
import { useClient, useTheme } from '../../Components/Container';
import { LinkButtonText, NormalButton } from '../../Components/Elements/Buttons';
import { Logo } from '../../Components/Elements/Assets';
import { convertFirstCharacterToUppercase, deviceInfo } from '../../Services';
import { requestNotificationPermission } from '../../Services/notifications';

const LoginScreen = ({ navigation }) => {

  const { t } = useTranslation('')
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const client = useClient();

  const [error, setError] = useState({
    error: false,
    response: ""
  });

  const [captcha, setCaptcha] = useState(false);
  const [users, setUsers] = useState({ 
    email: '',
    password: ''
  });

  const handleSubmit = async () => {

    if(!users.email || !users.password) return setError({ error: true, response: t(`errors.verify_fields`) })
    setCaptcha(true)
};

const onMessage = async (message) => {

  const data = message.nativeEvent.data;
  if(data === "cancel") return setCaptcha(false);

  const browser = await deviceInfo()
            
  let friendly_name;
  if (browser) {
    friendly_name = `${convertFirstCharacterToUppercase(browser.base_os)} ${browser.system_version} - Trender mobile`;
      
  } else {
      friendly_name = "Unknown Device";
  }

  const requestOptions = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      email: users.email.toLowerCase(),
      password: users.password,
      device_name: friendly_name,
      captcha_code: data
    })
  };

  setCaptcha(false)

  setLoading(true)

  const request = await fetch(`${apibaseurl}/login`, requestOptions)
  const response = await request.json();

  if(response.error){
    setLoading(false)
    return setError({ error: true, response: t(`errors.${response.error.code}`) })

  } else {

    await EncryptedStorage.setItem("user_info", JSON.stringify(response.data));
    
    const new_client = new Client({
      token: response.data.token,
      apiurl: apibaseurl
    })

    const informations = await new_client.informations();
    
    client.setValue({ ...client, client: new_client, token: response.data.token, user: informations.data, state: "loged" })

    const fcmToken = await requestNotificationPermission();

    if(fcmToken) await new_client.pushNotification.register(fcmToken);

    setTimeout(() => {
      navigation.replace('Bottom');
    }, 1000);
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
        <KeyboardAwareScrollView style={{ marginTop: 30 }} resetScrollToCoords={{ x: 0, y: 0 }}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <Logo />
            </View>
            <View style={styles.SectionStyle}>
              <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
            </View>
            <View style={styles.SectionStyle}>
              <PaperTextInput
                label={`${t("login.email")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.email}
                onChangeText={(email) => setUsers({ ...users, email: email })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <PaperTextInput
                label={`${t("login.password")}`}
                autoCapitalize="none"
                secureTextEntry={showPass}
                returnKeyType="next"
                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off" } />}
                value={users.password}
                onChangeText={(password) => setUsers({ ...users, password: password })}
              />
              <LinkButtonText text={t("login.forgot_password")} onPress={() => navigation.navigate('ForgotPassword')} />
            </View>
            <NormalButton onPress={() => handleSubmit()} text={t("login.connect")} />
            <View style={{
              textAlign: 'center',
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
              <LinkButtonText text={t("login.no_account")} onPress={() => navigation.navigate('RegisterEmailUsername')} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default LoginScreen;