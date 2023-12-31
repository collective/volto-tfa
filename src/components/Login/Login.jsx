import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import qs from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import {
  Container,
  Button,
  Form,
  Input,
  Segment,
  Grid,
} from 'semantic-ui-react';

import { Icon, Login, Toast } from '@plone/volto/components';
import { Helmet } from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

import { challenge, cancel } from '@plone-collective/volto-tfa/actions';

import aheadSVG from '@plone/volto/icons/ahead.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  otpChallenge: {
    id: 'otpChallenge',
    defaultMessage: 'OTP Challenge',
  },
  loginFailed: {
    id: 'Login Failed',
    defaultMessage: 'Login Failed',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  loginFailedContent: {
    id: 'The OTP you entered was not valid',
    defaultMessage: 'The OTP you entered was not valid',
  },
});

const AddTFA = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const otpChallenge = useSelector((state) => state.otpChallenge);
  const [otp, setOtp] = useState('');

  function onChallenge(event) {
    event.preventDefault();
    dispatch(challenge(otpChallenge.action, otpChallenge.login, otp));
  }

  return (
    <div id="page-login">
      <Helmet title={intl.formatMessage(messages.otpChallenge)} />
      <Container text>
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage id="Log In" defaultMessage="Login" />
          </Segment>
          <Segment secondary>
            <FormattedMessage
              id="Sign in to start session"
              defaultMessage="Sign in to start session"
            />
          </Segment>
          <Segment className="form">
            <Form method="post" onSubmit={onChallenge}>
              <Form.Field inline className="help">
                <Grid>
                  {otpChallenge.qr_code && (
                    <Grid.Row stretched>
                      <Grid.Column width="12">
                        <p>
                          <FormattedMessage
                            id="addTfaInstructions1"
                            defaultMessage="Install an OTP app in your mobile device (e.g. Google Authenticator, Microsoft Authenticator, Authy, LastPass Authenticator, ...)"
                          />
                        </p>
                        <p>
                          <FormattedMessage
                            id="addTfaInstructions2"
                            defaultMessage="Scan the QR code with your OTP app"
                          />
                        </p>
                        <p>
                          <FormattedMessage
                            id="addTfaInstructions3"
                            defaultMessage="Enter the OTP code generated by the app in the OTP field below"
                          />
                        </p>
                        <p>
                          <FormattedMessage
                            id="addTfaInstructions4"
                            defaultMessage="Click the confirm button. If the OTP code is correct, 2FA will be enabled. Next time you login, you will be asked for the OTP provided by your app."
                          />
                        </p>
                        <QRCodeSVG size={200} value={otpChallenge.qr_code} />
                      </Grid.Column>
                    </Grid.Row>
                  )}
                  <Grid.Row stretched>
                    <Grid.Column width="4">
                      <div className="wrapper">
                        <label htmlFor="otp">
                          <FormattedMessage
                            id="OTP Token"
                            defaultMessage="OTP Token"
                          />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width="8">
                      {/* eslint-disable jsx-a11y/no-autofocus */}
                      {/* TODO: https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/ */}
                      <Input
                        id="otp"
                        name="otp"
                        placeholder={intl.formatMessage(messages.otpChallenge)}
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form.Field>

              <Segment className="actions" clearing>
                <Button
                  basic
                  primary
                  icon
                  floated="right"
                  type="submit"
                  id="login-form-submit"
                  aria-label={intl.formatMessage(messages.otpChallenge)}
                  title={intl.formatMessage(messages.otpChallenge)}
                  loading={otpChallenge.loading}
                >
                  <Icon className="circled" name={aheadSVG} size="30px" />
                </Button>
                <Button
                  basic
                  secondary
                  icon
                  floated="right"
                  id="login-form-cancel"
                  as={Link}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(cancel());
                  }}
                  aria-label={intl.formatMessage(messages.cancel)}
                  title={intl.formatMessage(messages.cancel)}
                >
                  <Icon className="circled" name={clearSVG} size="30px" />
                </Button>
              </Segment>
            </Form>
          </Segment>
        </Segment.Group>
      </Container>
    </div>
  );
};

function TFALogin(props) {
  const { toastify } = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { toast } = toastify;
  const dispatch = useDispatch();

  const loginState = useSelector((state) => state.userSession.login);
  const token = useSelector((state) => state.userSession.token);
  const otpChallenge = useSelector((state) => state.otpChallenge);

  const returnUrl =
    qs.parse(location.search).return_url ||
    location.pathname.replace(/\/login\/?$/, '').replace(/\/logout\/?$/, '') ||
    '/';

  useEffect(() => {
    if (token) {
      history.push(returnUrl);

      if (toast.isActive('loggedOut')) {
        toast.dismiss('loggedOut');
      }
      if (toast.isActive('loginFailed')) {
        toast.dismiss('loginFailed');
      }
    }
    if (loginState.error) {
      if (toast.isActive('loggedOut')) {
        toast.dismiss('loggedOut');
      }
      if (!toast.isActive('loginFailed')) {
        toast.error(
          <Toast
            error
            title={intl.formatMessage(messages.loginFailed)}
            content={intl.formatMessage(messages.loginFailedContent)}
          />,
          { autoClose: false, toastId: 'loginFailed' },
        );
      }
    }
  }, [token, history, returnUrl, toast, loginState.error, intl]);

  useEffect(() => {
    return () => {
      dispatch(cancel());
    };
  }, [dispatch]);

  switch (otpChallenge.action) {
    case 'add':
    case 'challenge':
      return <AddTFA />;
    default:
      return <Login {...props} />;
  }
}

export default injectLazyLibs('toastify')(TFALogin);
