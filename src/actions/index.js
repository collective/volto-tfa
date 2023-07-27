import { LOGIN } from '@plone/volto/constants/ActionTypes';
export const OTP_CHALLENGE_CANCEL = 'OTP_CHALLENGE_CANCEL';

export function challenge(action, login, otp, signature) {
  return {
    type: LOGIN,
    request: {
      op: 'post',
      path: '@login',
      data: { action, login, otp, signature },
    },
  };
}

export function cancel() {
  return {
    type: OTP_CHALLENGE_CANCEL,
  };
}
