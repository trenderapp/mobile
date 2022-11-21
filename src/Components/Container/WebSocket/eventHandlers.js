import { useCallback } from 'react';

export const useConnectionCallback = () => {
  const callback = useCallback(() => {}, []);
  return callback;
};

export const useMessageCallback = (dispatch) => {
    const callback = useCallback((ev) => {
      const data = JSON.parse(ev.data);
      if(typeof data.code !== "undefined" && typeof data.data !== "undefined") dispatch({ code: data.code, data: data.data });
    }, [dispatch]);
  return callback;
};