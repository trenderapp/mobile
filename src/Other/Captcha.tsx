import React, { useEffect, useRef } from "react";
import Hcaptcha from '@hcaptcha/react-native-hcaptcha';
import { useTranslation } from 'react-i18next'
import { captchasiteKey } from "../Services/constante";
import { WebViewMessageEvent } from "react-native-webview";

type PropsTypes = {
    onMessage: any;
    show: boolean;
}

function CaptchaBlock({ onMessage, show }: PropsTypes) {
    const captchaform: any = useRef();
    const { i18n } = useTranslation("");

    useEffect(() => {
        if(show) captchaform.current.show()
        else captchaform.current.hide();
    }, [show])

    const onEvent = (event: WebViewMessageEvent) => {
        if (event && event.nativeEvent.data) {
            const data = event.nativeEvent.data;

            if(data === "open") return;
            else if (data === "cancel" || data === "error" || data === "expired") return onMessage('cancel');
            else onMessage(data)
          }
    }
    

    return (
        <>
            <Hcaptcha size="invisible" ref={captchaform} languageCode={i18n.language} siteKey={captchasiteKey ?? ""} onMessage={(event) => onEvent(event)} />
        </>
    )
}

export default CaptchaBlock;

