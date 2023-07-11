import React, { useRef, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Video from 'react-native-video';
import VideoControls from "react-native-video-controls";
import { full_height, full_width } from "../../../../Style/style";
import SvgElement from "../../../Elements/Svg";
import { useTheme } from "../../../Container";
import { useTranslation } from "react-i18next";

function VideoPlayer({ uri, thumbnail, attachments }) {

  const videoPlayer = useRef(null);
  const [repeat] = useState(true);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [full_screen, setFullScreen] = useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Modal visible={full_screen} animationType="slide" >
        {
          <VideoControls
            source={{
              uri: uri
            }}
            style={{
              width: full_width,
              height: full_height
            }}
            onBack={() => setFullScreen(false)}
            tapAnywhereToPause={false}
            disableFullscreen
          />
        }
      </Modal>

      <View style={{
        width: full_width,
        height: 250
      }}>
        {
          attachments?.nsfw ? (
            <Pressable style={{
              backgroundColor: colors.badge_color,
              width: full_width,
              height: "100%",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <IconButton icon="eye-off" />
              <Text>{t("posts.explicit_content")}</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => setFullScreen(true)} style={{
              width: full_width,
              height: 250
            }}>
              <Video
                poster={thumbnail}
                source={{
                  uri: uri
                }}
                resizeMode={'cover'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}
                paused={true}
                repeat={repeat}
                muted={muted}
                ref={(ref) => (videoPlayer.current = ref)}
              />
            </Pressable>
          )
        }
        {
          attachments?.nsfw ? null : (<>

            <IconButton style={{
              position: 'absolute',
              top: 10,
            }} icon="fullscreen" onPress={() => setFullScreen(true)} />

            <IconButton style={{
              position: 'absolute',
              top: 40
            }} onPress={() => {}} icon={paused ? "play-circle" : "play-circle"} />
            {
              /**
               *             

            <IconButton style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
            }} onPress={() => setMuted(!muted)} icon={muted ? "volume-variant-off" : "volume-high"} />
               */
            }

          </>
          )
        }
      </View>
    </>
  )
}

export default VideoPlayer;