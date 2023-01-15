import React, { useRef, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Video from 'react-native-video';
import VideoControls from "react-native-video-controls";
import { full_height, full_width } from "../../../../Style/style";
import SvgElement from "../../../Elements/Svg";

function VideoPlayer({ uri, creator }) {

  const videoPlayer = useRef(null);
  const [repeat] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [full_screen, setFullScreen] = useState(false);

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
        <Pressable onPress={() => setPaused(!paused)} style={{
        width: full_width,
        height: 250
      }}>
          <Video
            onEnd={() => setPaused(true)}
            source={{
              uri: uri
            }}
            resizeMode={'contain'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            onProgress={() => creator && setPaused(true)}
            paused={paused}
            repeat={repeat}
            muted={muted}
            ref={(ref) => (videoPlayer.current = ref)}
          />
        </Pressable>
      {
        creator ? null 
          : ( <>
            <View
                style={{
                  position: 'absolute',
                  bottom: 75,
                  left: 10,
                }} >
                <SvgElement onPress={() => {
                  setPaused(true)
                  setFullScreen(true)
                }} size={22} name={"full-screen"} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 10,
                }} >
                <SvgElement onPress={() => setPaused(!paused)} size={22} name={paused ? "play" : "pause"} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                }} >
                <SvgElement onPress={() => setMuted(!muted)} size={22} name={muted ? "sound-mute" : "sound"} />
              </View>
          </>
        )
      }
      </View>
    </>
  )
}

export default VideoPlayer;