import React, { Suspense, lazy } from "react";
import { Text } from "react-native-paper";
const Renderer = lazy(() => import("./Markdown/Renderer"));

export default function Markdown({ content, noBr, maxLine }) {
    return (
        <Text numberOfLines={maxLine}>
            <Suspense fallback={content}>
                <Renderer noBr={noBr} maxLine={maxLine} content={content} />
            </Suspense>
        </Text>
    );
}
