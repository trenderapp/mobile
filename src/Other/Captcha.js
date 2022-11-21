import React, { useEffect, useRef } from "react";
import Hcaptcha from '@hcaptcha/react-native-hcaptcha';
import { captchasiteKey } from "../Services/constante";

function CaptchaBlock({ onMessage, show }) {
    const captchaform = useRef();

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

