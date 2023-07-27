import TFALogin from './components/Login/Login';
import TFAPreferences, {
  Pluggables,
} from './components/Preferences/Preferences';

import QRCodeWidget from './components/Preferences/QRCodeWidget';

// import { Login } from '@plone/volto/components';
import otpChallenge from './reducers';
// import StandardWrapper from '@plone/volto/components/manage/Toolbar/StandardWrapper';

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

  // https://maurits.vanrees.org/weblog/archive/2021/11/tiberiu-ichim-volto-pluggables
  // https://github.com/plone/volto/issues/3040
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '',
      component: Pluggables,
    },
  ];

  // config.settings.additionalToolbarComponents = {
  //   ...(config.settings.additionalToolbarComponents || {}),
  //   tfa_preferences: {
  //     component: TFAPreferences,
  //     wrapper: StandardWrapper,
  //     wrapperTitle: messages.tfaPreferences,
  //     hideToolbarBody: true,
  //   },
  // };

  if (config.widgets?.widget) {
    config.widgets.widget.qrcode_otp_widget = QRCodeWidget;
  }

  return config;
};

export default applyConfig;
