import React, { Suspense, lazy } from "react";
import { Text } from "react-native-paper";
const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string, 
    noBr?: boolean, 
    maxLine?: number,
}>

const Markdown: SectionProps = ({ content, noBr, maxLine }) => {
    return (
        <Text numberOfLines={maxLine}>
            <Suspense fallback={content}>
                <Renderer noBr={noBr ? false : true} maxLine={maxLine} content={content} />
            </Suspense>
        </Text>
    );
}

export default Markdown;