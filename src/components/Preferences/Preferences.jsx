import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';
import { getUser, updateUser } from '@plone/volto/actions';
import { usePrevious } from '@plone/volto/helpers';
import { Form, Icon, Toast } from '@plone/volto/components';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { schemaFactory } from '@plone-collective/volto-tfa/components/Preferences/schemaFactory';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';

export const Pluggables = () => {
  return (
    <Plug pluggable="toolbar-user-menu" id="tfa-preferences">
      {() => {
        return (
          <li>
            <Link id="tfaPreferences" to="/tfa-preferences">
              <FormattedMessage
                id="tfaPreferences"
                defaultMessage="OTP Preferences"
              />
              <Icon name={rightArrowSVG} size="24px" />
            </Link>
          </li>
        );
      }}
    </Plug>
  );
};

function Preferences({ closeMenu, toastify }) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const { toast } = toastify;

  const user = useSelector((state) => state.users.user);
  const userId = useSelector((state) =>
    state.userSession.token ? jwtDecode(state.userSession.token).sub : '',
  );
  const updated = useSelector((state) => state.users.update.loaded);
  const updating = useSelector((state) => state.users.update.loading);
  const error = useSelector((state) => state.users.update.error);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  const prevUpdating = usePrevious(updating);
  useEffect(() => {
    if (prevUpdating && updated) {
      toast.success(
        <Toast
          success
          title={intl.formatMessage({ id: 'Success' })}
          content={intl.formatMessage({ id: 'Saved' })}
        />,
      );
      if (closeMenu) closeMenu();
      else history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUpdating, updated]);

  useEffect(() => {
    if (prevUpdating && error) {
      toast.error(
        <Toast
          error
          title={intl.formatMessage({ id: 'Error' })}
          content={intl.formatMessage({
            id: 'InvalidOTP',
            defaultMessage: error.response.body.error.message,
          })}
        />,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUpdating, error]);

  useEffect(() => {
    if (prevUpdating && error) {
      toast.error(
        <Toast
          error
          title={intl.formatMessage({ id: 'Error' })}
          content={intl.formatMessage({
            id: 'InvalidOTP',
            defaultMessage: error.response.body.error.message,
          })}
        />,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUpdating, error]);

  function onChangeFormData(data) {
    setEnabled(!!data.two_factor_authentication_enabled);
  }

  function onSubmit(data) {
    data = Object.fromEntries(
      Object.entries(data)
        .filter(([k, v]) => k.startsWith('two_factor_authentication'))
        .map(([k, v]) => [
          k,
          k === 'two_factor_authentication_enabled' ||
          data.two_factor_authentication_enabled
            ? v
            : null,
        ]),
    );
    dispatch(updateUser(userId, data));
  }

  function onCancel() {
    if (closeMenu) closeMenu();
    else history.goBack();
  }

  if (!user['@id']) return null;

  return (
    <>
      <Container>
        <Segment.Group raised>
          <Segment>
            <h2>
              <FormattedMessage
                id="tfa_preferences_title"
                defaultMessage="Two Factor Authentication"
              />
            </h2>
            <FormattedMessage
              id="tfa_preferences_description"
              defaultMessage="To configure Two Factor Authentication (2FA), you should link your account and the authentication app on your mobile device."
            />
            <ol>
              <li>
                <FormattedMessage
                  id="tfa_preferences_step1"
                  defaultMessage="Enable Two Factor authentication using the checkbox below"
                />
              </li>
              <li>
                <FormattedMessage
                  id="tfa_preferences_step2"
                  defaultMessage="Install an OTP app in your mobile device (e.g. Google Authenticator, Microsoft Authenticator, Authy, LastPass Authenticator, ...)"
                />
              </li>
              <li>
                <FormattedMessage
                  id="tfa_preferences_step3"
                  defaultMessage="Scan the QR code with your OTP app"
                />
              </li>
              <li>
                <FormattedMessage
                  id="tfa_preferences_step4"
                  defaultMessage="Enter the OTP code generated by the app in the OTP field below"
                />
              </li>
              <li>
                <FormattedMessage
                  id="tfa_preferences_step5"
                  defaultMessage="Click the confirm button. If the OTP code is correct, 2FA will be enabled. Next time you login, you will be asked for the OTP provided by your app."
                />
              </li>
            </ol>
            <p>
              <FormattedMessage
                id="tfa_preferences_reset"
                defaultMessage="If you need to reset your 2FA, you can do it by clicking the checkbox below, disabling 2FA, and then enabling it again."
              />
            </p>
          </Segment>
        </Segment.Group>
      </Container>
      <p></p>
      <Form
        formData={user}
        schema={schemaFactory(intl, enabled)}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onChangeFormData={onChangeFormData}
        loading={updating}
      ></Form>
    </>
  );
}

Preferences.propTypes = {
  closeMenu: PropTypes.func,
};

export default injectLazyLibs(['toastify'])(Preferences);
