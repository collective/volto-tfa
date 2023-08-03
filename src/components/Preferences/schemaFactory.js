import { defineMessages } from 'react-intl';

export const schemaFactory = (intl, enabled) => ({
  fieldsets: [
    {
      behavior: 'plone',
      fields: [
        'two_factor_authentication_enabled',
        'two_factor_authentication_secret',
        'two_factor_authentication_otp',
      ],
      id: 'default',
      title: 'Default',
    },
  ],
  properties: {
    two_factor_authentication_enabled: {
      description: intl.formatMessage(messages.tfaFormEnabledDescription),
      factory: 'Yes/No',
      title: intl.formatMessage(messages.tfaFormEnabledTitle),
      type: 'boolean',
    },
    two_factor_authentication_secret: {
      title: intl.formatMessage(messages.tfaFormSecretTitle),
      description: intl.formatMessage(messages.tfaFormSecretDescription),
      type: 'string',
      mode: enabled ? 'edit' : 'hidden',
      widget: 'qrcode_otp_widget',
    },
    // TODO: add custom widget https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/
    two_factor_authentication_otp: {
      description: intl.formatMessage(messages.tfaFormOtpDescription),
      factory: 'Text line (String)',
      title: intl.formatMessage(messages.tfaFormOtpTitle),
      mode: enabled ? 'edit' : 'hidden',
    },
  },
  required: enabled ? ['two_factor_authentication_otp'] : [],
  type: 'object',
});

const messages = defineMessages({
  tfaFormEnabledTitle: {
    id: 'tfaFormEnabledTitle',
    defaultMessage: 'Two Factor Authentication',
  },
  tfaFormEnabledDescription: {
    id: 'tfaFormEnabledDescription',
    defaultMessage:
      'To configure Two Factor Authentication (2FA), you should link your account and the authentication app on your mobile device.',
  },
  tfaFormSecretTitle: {
    id: 'tfaFormSecretTitle',
    defaultMessage: 'Secret',
  },
  tfaFormSecretDescription: {
    id: 'tfaFormSecretDescription',
    defaultMessage: 'Scan this QR code with your OTP app.',
  },
  tfaFormOtpTitle: {
    id: 'tfaFormOtpTitle',
    defaultMessage: 'OTP',
  },
  tfaFormOtpDescription: {
    id: 'tfaFormOtpDescription',
    defaultMessage: 'Enter the OTP code from your OTP app.',
  },
});
