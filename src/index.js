import TFALogin from '@plone-collective/volto-tfa/components/Login/Login';
import TFAPreferences, {
  Pluggables,
} from '@plone-collective/volto-tfa/components/Preferences/Preferences';

import QRCodeWidget from '@plone-collective/volto-tfa/components/Preferences/QRCodeWidget';

import otpChallenge from '@plone-collective/volto-tfa/reducers';

const applyConfig = (config) => {
  config.addonReducers = {
    ...config.addonReducers,
    otpChallenge,
  };
  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/login',
      component: TFALogin,
    },
    {
      path: '**/login',
      component: TFALogin,
    },
    {
      path: '/tfa-preferences',
      component: TFAPreferences,
      exact: true,
    },
  ];
  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    '/tfa-preferences',
  ];

  // https://maurits.vanrees.org/weblog/archive/2021/11/tiberiu-ichim-volto-pluggables
  // https://github.com/plone/volto/issues/3040
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '',
      component: Pluggables,
    },
  ];

  if (config.widgets?.widget) {
    config.widgets.widget.qrcode_otp_widget = QRCodeWidget;
  }

  return config;
};

export default applyConfig;
