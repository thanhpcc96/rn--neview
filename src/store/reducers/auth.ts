type payloadAuthReducer = {
  type: 'auth/markLogin' | 'auth/logout';
  data?: any;
};

const initState = {
  isLogged: false,
  users: null,
  accessToken: null,
};

export const auth = (state = initState, payload: payloadAuthReducer) => {
  switch (payload.type) {
    case 'auth/markLogin':
      return { ...state, isLogged: true, ...payload.data };
    case 'auth/logout':
      return initState;

    default:
      return state;
  }
};
