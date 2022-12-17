import React, { useEffect, useRef } from "react";
import Hcaptcha from '@hcaptcha/react-native-hcaptcha';
import { useTranslation } from 'react-i18next'
import { captchasiteKey } from "../Services/constante";
import { NormalButton } from "../Components/Elements/Buttons";

function CaptchaBlock({ onMessage, show }) {
    const captchaform = useRef();
    const { t } = useTranslation("");

    useEffect(() => {
        if(show) captchaform.current.show()
        else captchaform.current.hide();
    }, [show])

    return (
        <>
            <Hcaptcha ref={captchaform} siteKey={captchasiteKey} onMessage={(message) => onMessage(message)} />
        </>
    )
}

export default CaptchaBlock;

