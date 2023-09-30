import React from 'react';
import Video from 'react-native-video';
import { IconButton } from 'react-native-paper';

type SectionProps = {
    uri: string;
    index: number;
    deleteImage: (idx: number) => any
}

export default function CreatorVideoDisplay({ uri, index, deleteImage }: SectionProps) {

    return (
        <>
            <IconButton
                onPress={() => deleteImage(index)}
                icon="close-circle"
                style={{
                    position: "absolute",
                    zIndex: 2,
                    right: 0
                }}
            />
            <IconButton
                icon="video"
                style={{
                    position: "absolute",
                    zIndex: 2,
                    left: 0,
                    bottom: 0
                }}
            />
            <Video source={{ uri: uri }}
                resizeMode={'cover'}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    margin: 5
                }}
                paused={true}
                repeat={false}
                muted={true}
            />
        </>
    )
}