import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { START_RECORDING_DELAY, CAPTURE_BUTTON_SIZE, BORDER_WIDTH, SCREEN_HEIGHT, PAN_GESTURE_HANDLER_FAIL_X, PAN_GESTURE_HANDLER_ACTIVE_Y } from "./Constants";
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { Camera, PhotoFile, TakePhotoOptions, VideoFile } from 'react-native-vision-camera';

interface Props extends ViewProps {
  camera: React.RefObject<Camera>
  onMediaCaptured: (media: PhotoFile | VideoFile, type: 'photo' | 'video') => void

  minZoom: number
  maxZoom: number
  cameraZoom: Reanimated.SharedValue<number>

  flash: 'off' | 'on'

  enabled: boolean

  setIsPressingButton: (isPressingButton: boolean) => void
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  setIsPressingButton,
  style,
  ...props
}) => {

  const pressDownDate = useRef<Date | undefined>(undefined)
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);

  const isPressingButton = useSharedValue(false);

  const takePhotoOptions = useMemo<TakePhotoOptions>(
    () => ({
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      enableShutterSound: false,
    }),
    [flash],
  )

  //#region Camera Capture
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      const photo = await camera.current.takePhoto(takePhotoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e: any) {
      Toast.show({
        text1: `Failed to take photo`,
        text2: e
      })
    }
  }, [camera, onMediaCaptured]);

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      await camera.current.stopRecording();

    } catch (e: any) {
      Toast.show({
        text1: `Failed to stop recording`,
        text2: e
      })
    }
  }, [camera]);

  const startRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          Toast.show({
            text1: `Recording failed !`,
            text2: error.cause?.message
          })
          onStoppedRecording();
        },
        onRecordingFinished: (video) => {
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });

      isRecording.current = true;
    } catch (e) {
      Toast.show({
        text1: `failed to start recording!`
      })
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
  //#endregion

  //#region Tap handler
  const tapHandler = useRef<TapGestureHandler>()
  const onHandlerStateChanged = useCallback(
    async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
      // This is the gesture handler for the circular "shutter" button.
      // Once the finger touches the button (State.BEGAN), a photo is being taken and "capture mode" is entered. (disabled tab bar)
      // Also, we set `pressDownDate` to the time of the press down event, and start a 200ms timeout. If the `pressDownDate` hasn't changed
      // after the 200ms, the user is still holding down the "shutter" button. In that case, we start recording.
      //
      // Once the finger releases the button (State.END/FAILED/CANCELLED), we leave "capture mode" (enable tab bar) and check the `pressDownDate`,
      // if `pressDownDate` was less than 200ms ago, we know that the intention of the user is to take a photo. We check the `takePhotoPromise` if
      // there already is an ongoing (or already resolved) takePhoto() call (remember that we called takePhoto() when the user pressed down), and
      // if yes, use that. If no, we just try calling takePhoto() again
      console.debug(`state: ${Object.keys(State)[event.state]}`)
      switch (event.state) {
        case State.BEGAN: {
          // enter "recording mode"
          recordingProgress.value = 0
          isPressingButton.value = true
          const now = new Date()
          pressDownDate.current = now
          setTimeout(() => {
            if (pressDownDate.current === now) {
              // user is still pressing down after 200ms, so his intention is to create a video
              startRecording()
            }
          }, START_RECORDING_DELAY)
          setIsPressingButton(true)
          return
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          // exit "recording mode"
          try {
            if (pressDownDate.current == null) throw new Error('PressDownDate ref .current was null!')
            const now = new Date()
            const diff = now.getTime() - pressDownDate.current.getTime()
            pressDownDate.current = undefined
            if (diff < START_RECORDING_DELAY) {
              // user has released the button within 200ms, so his intention is to take a single picture.
              await takePhoto()
            } else {
              // user has held the button for more than 200ms, so he has been recording this entire time.
              await stopRecording()
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false
              setIsPressingButton(false)
            }, 500)
          }
          return
        }
        default:
          break
      }
    },
    [isPressingButton, recordingProgress, setIsPressingButton, startRecording, stopRecording, takePhoto],
  )

  //#endregion
  //#region Pan handler
  const panHandler = useRef<PanGestureHandler>()
  const onPanGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { offsetY?: number; startY?: number }>({
    onStart: (event, context) => {
      context.startY = event.absoluteY
      const yForFullZoom = context.startY * 0.7
      const offsetYForFullZoom = context.startY - yForFullZoom

      // extrapolate [0 ... 1] zoom -> [0 ... Y_FOR_FULL_ZOOM] finger position
      context.offsetY = interpolate(cameraZoom.value, [minZoom, maxZoom], [0, offsetYForFullZoom], Extrapolate.CLAMP)
    },
    onActive: (event, context) => {
      const offset = context.offsetY ?? 0
      const startY = context.startY ?? SCREEN_HEIGHT
      const yForFullZoom = startY * 0.7

      cameraZoom.value = interpolate(event.absoluteY - offset, [yForFullZoom, startY], [maxZoom, minZoom], Extrapolate.CLAMP)
    },
  })
  //#endregion


  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isPressingButton.value ? CAPTURE_BUTTON_SIZE / 1.5 : CAPTURE_BUTTON_SIZE / 3, { damping: 5, stiffness: 200 }),
      height: withSpring(isPressingButton.value ? CAPTURE_BUTTON_SIZE / 1.5 : CAPTURE_BUTTON_SIZE / 3, { damping: 5, stiffness: 200 })
    };
  });

  return (
    <TapGestureHandler
      enabled={enabled}
      ref={tapHandler}
      onHandlerStateChange={onHandlerStateChanged}
      shouldCancelWhenOutside={false}
      maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside of the child view (to zoom)
      simultaneousHandlers={panHandler}>
      <Reanimated.View {...props} style={[style]}>
        <PanGestureHandler
          enabled={enabled}
          ref={panHandler}
          failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
          activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
          onGestureEvent={onPanGestureEvent}
          simultaneousHandlers={tapHandler}>
          <Reanimated.View style={styles.flex}>
            <Reanimated.View style={styles.button}>
              <Reanimated.View style={[{
                borderRadius: CAPTURE_BUTTON_SIZE / 2,
                backgroundColor: '#E34077',
              }, buttonAnimationStyle]} />
            </Reanimated.View>
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
    </TapGestureHandler>
  );
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});