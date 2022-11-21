import React, { useRef } from "react";
import Hcaptcha from '@hcaptcha/react-native-hcaptcha';
import { useTranslation } from 'react-i18next'
import { NormalButton } from "../Buttons";
import { captchasiteKey } from "../../../Services/constante";

function CaptchaBlock({ onMessage }) {
    const captchaform = useRef();
    const { t } = useTranslation("");

    const onMessage = (message) => {
        onMessage(message?.nativeEvent?.data)
    }

    return (
        <>
            <Hcaptcha ref={captchaform} siteKey={captchasiteKey} onMessage={(message) => onMessage(message)} />
            <NormalButton text={t("login.human_verif")} onPress={() => { 
                captchaform.current.show();
            }} />
        </>
    )
}

export default CaptchaBlock;