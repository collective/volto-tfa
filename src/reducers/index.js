import { LOGIN } from '@plone/volto/constants/ActionTypes';
import { OTP_CHALLENGE_CANCEL } from '../actions';

const initialState = {
  loading: false,
  login: null,
  type: null,
  action: null,
  qr_code: null,
  signature: null,
};

function otpChallenge(state = initialState, action = {}) {
  switch (action.type) {
    case `${LOGIN}_PENDING`:
      return {
        ...state,
        loading: true,
      };
    case `${LOGIN}_SUCCESS`:
      return {
        ...state,
        loading: false,
        action: action.result.action,
        type: action.result.type,
        login: action.result.login,
        qr_code: action.result.qr_code,
        signature: action.result.signature,
      };
    case `${LOGIN}_FAIL`:
      return {
        ...state,
        loading: false,
      };
    case OTP_CHALLENGE_CANCEL:
      return { ...initialState };
    default:
      return state;
  }
}

export default otpChallenge;
