import { Dimensions, Platform } from 'react-native';

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select({
  android: Dimensions.get('screen').height,
  ios: Dimensions.get('window').height,
});

export const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
export const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

export const SCALE_FULL_ZOOM = 3;
export const BUTTON_SIZE = 40;

export const START_RECORDING_DELAY = 200;
export const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

export const CONTENT_SPACING = 15;

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;