import { Linking, Platform } from "react-native";
import axios from "axios";
import { apibaseurl } from "./constante";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import DeviceInfo from 'react-native-device-info';
import { formatDate } from "./dayjs";

export * from "./navigationProps";

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

export const convertFirstCharacterToUppercase = (stringToConvert: string) => {
  var firstCharacter = stringToConvert.substring(0, 1);
  var restString = stringToConvert.substring(1);

  return firstCharacter.toUpperCase() + restString;
}

export const messageFormatDate = (date: Date | string | number) => new formatDate(date);

export const subscriptionCustomAllowedPrices = {
  min: 3,
  max: 1000 
}

export const subscriptionCurrencyArray = [
  {
    symbol: "€",
    name: "eur"
  },
  {
    symbol: "$",
    name: "usd"
  }
]

/**
 * 
 * @param {Array} arr 
 * @param {Number} toIndex 
 * @param {Number} fromIndex 
 * @returns 
 */
export const changeElementPlaceArray = (arr: Array<any>, toIndex: number, fromIndex: number) => {

  const element = arr.splice(fromIndex, 1)[0];

  arr.splice(toIndex, 0, element);
  
  return arr;
}

export const translateText = async (user_token: string, options: { content: string, to: string}) => {
  const request = await axiosInstance.post("/translate", options, {
    headers: {
      "trendertokenapi": user_token
    }
  });  
  return request.data.data as string;
}

export const deviceInfo = async () => {
  
  return {
    device_name: DeviceInfo.getBrand(),
    device_id: DeviceInfo.getDeviceId(),
    base_os: Platform.OS,
    device_brand: DeviceInfo.getModel(),
    system_version: DeviceInfo.getSystemVersion(),
    build_number: DeviceInfo.getBuildNumber(),
    bundle_id: DeviceInfo.getBundleId(),
    version: DeviceInfo.getVersion()
  }
}

export const axiosInstance = axios.create({
  baseURL: apibaseurl,
  validateStatus: s => s < 501,
});

export const getAppInfo = async () => {
  const version = DeviceInfo.getBuildNumber();
  const request = await axiosInstance.get("/status");
  const response = request.data as { 
    data: {
      status: "Online",
      api_version: string,
      android_version?: number,
      ios_version?: number
    }
  }
  
  if(!response.data?.ios_version || !response.data?.android_version) return false;
  if(Platform.OS === "ios") return response.data.ios_version > parseInt(version);
  if(Platform.OS === "android") return response.data.android_version > parseInt(version);
  return false;
}

export const storeLink = (): string => {
  if(Platform.OS === "ios") return "https://apps.apple.com/app/trender-social-network/id6443865410";
  if(Platform.OS === "android") return "https://play.google.com/store/apps/details?id=com.trenderapp.social";
  return "https://trenderapp.com"
}

export const getPermissions = async () => {
  const camera = await check(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
  if(camera !== RESULTS.GRANTED) await request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);

  const library = await check(Platform.OS === "ios" ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);
  if(library !== RESULTS.GRANTED) await request(Platform.OS === "ios" ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);

  const IOSLibrary = Platform.OS === "ios" && await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  if(IOSLibrary !== RESULTS.GRANTED) await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

  const IOSMicrophone = Platform.OS === "ios" && await check(PERMISSIONS.IOS.MICROPHONE);
  if(IOSMicrophone !== RESULTS.GRANTED) await request(PERMISSIONS.IOS.MICROPHONE);

}

export const openURL = async (url: string) => {
  await Linking.openURL(url);
}

export const cguLink = (language: string) => {
  let lang = "https://cdn.trenderapp.com/assets/legal/en/terms_of_use.pdf"
  if(language === "fr") lang = "https://cdn.trenderapp.com/assets/legal/fr/terms_of_use.pdf"
  return lang;
}

export const cgvLink = (language: string) => {
  let lang = "https://cdn.trenderapp.com/assets/legal/en/terms_of_sales.pdf"
  if(language === "fr") lang = "https://cdn.trenderapp.com/assets/legal/fr/terms_of_sales.pdf"
  return lang;
}

export const privacyLink = (language: string) => {
  let lang = "https://cdn.trenderapp.com/assets/legal/en/privacy.pdf"
  if(language === "fr") lang = "https://cdn.trenderapp.com/assets/legal/fr/privacy.pdf"
  return lang;
}

export const parseURL = (url: string): string | false => {
    if(!url) return false;

    let link = [""];
    if(url.startsWith("https://www.trenderapp.com")) link = url.split("https://www.trenderapp.com");
    else if(url.startsWith("https://trenderapp.com")) link = url.split("https://trenderapp.com");
    else if(url.startsWith("http://www.trenderapp.com")) link = url.split("http://www.trenderapp.com");
    else if(url.startsWith("http://trenderapp.com")) link = url.split("http://trenderapp.com");
    
    return link[1];
}

export const NameValidator = (value: string) => {
  return RegExpValidator(PATTERN_NAME, value);
};

export const DOBValidator = (value: string) => {
  return RegExpValidator(PATTERN_DOB, value);
};

export const EmailValidator = (value: string) => {
  return RegExpValidator(PATTERN_EMAIL, value);
};

export const PasswordValidator = (value: string) => {
  return RegExpValidator(PATTERN_PASSWORD, value);
};

export const PhoneNumberValidator = (value: string) => {
  return RegExpValidator(PATTERN_PHONE, value);
};

export const SMSCodeValidator = (value: string) => {
  return RegExpValidator(PATTERN_SMS_CODE, value);
};

export const CardNumberValidator = (value: string) => {
  return RegExpValidator(PATTERN_CARD_NUMBER, value);
};

export const ExpirationDateValidator = (value: string) => {
  return RegExpValidator(PATTERN_CARD_EXPIRE_DATE, value);
};

export const CvvValidator = (value: string) => {
  return RegExpValidator(PATTERN_CARD_CVV, value);
};

export const CardholderNameValidator = (value: string) => {
  return RegExpValidator(PATTERN_FULLNAME, value);
};

export const StringValidator = (value: string) => {
  return !!value && value.length > 0;
};

const RegExpValidator = (regexp: RegExp, value: string) => {
  return regexp.test(value);
};
