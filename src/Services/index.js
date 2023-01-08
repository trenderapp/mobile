import { Linking, Platform } from "react-native";
import axios from "axios";
import { apibaseurl } from "./constante";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import DeviceInfo from 'react-native-device-info';
import { formatDate } from "./dayjs";

export const PATTERN_NAME = /[a-z ,.'-]+/;
export const PATTERN_DOB = /\d{1,2}\/\d{1,2}\/\d{4}/;
export const PATTERN_EMAIL = /\S+@\S+\.\S+/;
export const PATTERN_PASSWORD = /[a-z0-9]{8,}/;
export const PATTERN_PHONE = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
export const PATTERN_SMS_CODE = /\d{4}/;
export const PATTERN_CARD_NUMBER = /\d{4} \d{4} \d{4} \d{4}/;
export const PATTERN_CARD_EXPIRE_DATE = /\d{2}\/\d{2}/;
export const PATTERN_CARD_CVV = /\d{3}/;
export const PATTERN_FULLNAME = /^$|^[a-zA-ZčČćĆđĐšŠžŽ-]+ [a-zA-ZčČćĆđĐšŠžŽ-]+$/;

export const convertFirstCharacterToUppercase = (stringToConvert) => {
  var firstCharacter = stringToConvert.substring(0, 1);
  var restString = stringToConvert.substring(1);

  return firstCharacter.toUpperCase() + restString;
}

export const messageFormatDate = (date) => new formatDate(date);

/**
 * 
 * @param {Array} arr 
 * @param {Number} toIndex 
 * @param {Number} fromIndex 
 * @returns 
 */
export const changeElementPlaceArray = (arr, toIndex, fromIndex) => {

  const element = arr.splice(fromIndex, 1)[0];

  arr.splice(toIndex, 0, element);
  
  return arr;
}

export const deviceInfo = async () => {
  
  return {
    device_name: DeviceInfo.getBrand(),
    device_id: DeviceInfo.getDeviceId(),
    base_os: Platform.OS,
    device_brand: DeviceInfo.getModel(),
    system_version: DeviceInfo.getSystemVersion()
  }
}

export const axiosInstance = axios.create({
  baseURL: apibaseurl,
  validateStatus: s => s < 501,
});

export const getPermissions = async () => {
  const camera = await check(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
  if(camera !== RESULTS.GRANTED || camera !== RESULTS.LIMITED) await request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);

  const library = await check(Platform.OS === "ios" ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);
  if(library !== RESULTS.GRANTED || library !== RESULTS.LIMITED) await request(Platform.OS === "ios" ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);

  const IOSLibrary = Platform.OS === "ios" && await check([PERMISSIONS.IOS.PHOTO_LIBRARY]);
  if(IOSLibrary !== RESULTS.GRANTED || IOSLibrary !== RESULTS.LIMITED) await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

  const IOSMicrophone = Platform.OS === "ios" && await check([PERMISSIONS.IOS.MICROPHONE]);
  if(IOSMicrophone !== RESULTS.GRANTED || IOSMicrophone !== RESULTS.LIMITED) await request(PERMISSIONS.IOS.MICROPHONE);

}

export const openURL = async (url) => {
  await Linking.openURL(url);
}

export const cguLink = (language) => {
  let lang = "https://cdn.trenderapp.com/assets/legal/T&S.pdf"
  if(language === "fr") lang = "https://cdn2.trenderapp.com/assets/legal/CGU.pdf"
  return lang;
}

/**
 * 
 * @param {String} url 
 * @returns {Array<String>}
 */
export const parseURL = (url) => {
    if(!url) return false;

    let link;
    if(url.startsWith("https://www.trenderapp.com")) link = url.split("https://www.trenderapp.com");
    else if(url.startsWith("https://trenderapp.com")) link = url.split("https://trenderapp.com");
    else if(url.startsWith("http://www.trenderapp.com")) link = url.split("http://www.trenderapp.com");
    else if(url.startsWith("http://trenderapp.com")) link = url.split("http://trenderapp.com");
    
    return link.slice(1);
}

export const NameValidator = (value) => {
  return RegExpValidator(PATTERN_NAME, value);
};

export const DOBValidator = (value) => {
  return RegExpValidator(PATTERN_DOB, value);
};

export const EmailValidator = (value) => {
  return RegExpValidator(PATTERN_EMAIL, value);
};

export const PasswordValidator = (value) => {
  return RegExpValidator(PATTERN_PASSWORD, value);
};

export const PhoneNumberValidator = (value) => {
  return RegExpValidator(PATTERN_PHONE, value);
};

export const SMSCodeValidator = (value) => {
  return RegExpValidator(PATTERN_SMS_CODE, value);
};

export const CardNumberValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_NUMBER, value);
};

export const ExpirationDateValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_EXPIRE_DATE, value);
};

export const CvvValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_CVV, value);
};

export const CardholderNameValidator = (value) => {
  return RegExpValidator(PATTERN_FULLNAME, value);
};

export const StringValidator = (value) => {
  return !!value && value.length > 0;
};

const RegExpValidator = (regexp, value) => {
  return regexp.test(value);
};
