export const initialWebSocketState = {
    code: -1,
    connected: false,
    data: ""
};

export const reducer = (state = initialWebSocketState, action) => {
    
    switch(action.code) {
        case 0:
            return { code: action.code, data: "waiting", connected: false };
        case 1:
            return { code: action.code, data: "", connected: true };
        default:
            return { ...state, code: action.code, data: action.data };
    }
}