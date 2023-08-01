import { getUser, updateUser } from '@plone/volto/actions';
import { Form, Icon, Toast } from '@plone/volto/components';

import { Plug } from '@plone/volto/components/manage/Pluggable';
import { messages } from '@plone/volto/helpers';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { compose } from 'redux';
import { Container, Segment } from 'semantic-ui-react';
// const messages = defineMessages({
//     tfaPreferences: {
//     id: 'tfaPreferences',
//     defaultMessage: 'OTP preferences',
//   },
// });

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

class Preferences extends Component {
  static propTypes = {
    user: PropTypes.shape({
      fullname: PropTypes.string,
      email: PropTypes.string,
      home_page: PropTypes.string,
      location: PropTypes.string,
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    closeMenu: PropTypes.func,
  };

  //   const [showQrcode, setShowQrcode] = useState('');

  constructor(props) {
    super(props);
    this.state = {
      showQrcode: false,
      schema: {
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
            description:
              'To configure Two-Factor Authentication (2FA), you should link your account and the authentication app on your mobile device.',
            factory: 'Yes/No',
            title: 'Two Factor Authentication',
            type: 'boolean',
          },
          two_factor_authentication_secret: {
            title: 'Secret',
            description: 'Scan this QR code with your OTP app.',
            type: 'string',
            mode: 'hidden',
            widget: 'qrcode_otp_widget',
          },
          // TODO: add custom widget https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/
          two_factor_authentication_otp: {
            description: 'Enter OTP',
            factory: 'Text line (String)',
            title: 'OTP',
            mode: 'hidden',
          },
        },
        required: [],
        type: 'object',
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getUser(this.props.userId);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.updated && this.props.updated) {
      toast.success(
        <Toast
          success
          title={this.props.intl.formatMessage(messages.success)}
          content={this.props.intl.formatMessage(messages.saved)}
        />,
      );
      if (this.props.closeMenu) this.props.closeMenu();
      else this.props.history.goBack();
    }
  }

  onChangeFormData = (data) => {
    if (data.two_factor_authentication_enabled) {
      this.setState({
        showQrcode: true,
        schema: {
          ...this.state.schema,
          properties: {
            ...this.state.schema.properties,
            two_factor_authentication_secret: {
              ...this.state.schema.properties.two_factor_authentication_secret,
              mode: 'edit',
            },
            two_factor_authentication_otp: {
              ...this.state.schema.properties.two_factor_authentication_otp,
              mode: 'edit',
            },
          },
          required: [
            // 'two_factor_authentication_secret',
            'two_factor_authentication_otp',
          ],
        },
      });
    } else {
      this.setState({
        showQrcode: false,
        schema: {
          ...this.state.schema,
          properties: {
            ...this.state.schema.properties,
            two_factor_authentication_secret: {
              ...this.state.schema.properties.two_factor_authentication_secret,
              mode: 'hidden',
            },
            two_factor_authentication_otp: {
              ...this.state.schema.properties.two_factor_authentication_otp,
              mode: 'hidden',
            },
          },
          required: [],
        },
      });
    }
  };

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
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
    this.props.updateUser(this.props.userId, data);
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    if (this.props.closeMenu) this.props.closeMenu();
    else this.props.history.goBack();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return this.props?.user?.['@id'] ? (
      <>
        <Container>
          <Segment.Group raised>
            <Segment>
              <h2>Two Factor Authentication</h2>
              To configure Two-Factor Authentication (2FA), you should link your
              account and the authentication app on your mobile device.
              <ol>
                <li>
                  Enable Two Factor authentication using the checkbox below
                </li>
                <li>
                  Install an OTP app in your mobile device (e.g. Google
                  Authenticator, Microsft Authenticator, Authy, LastPass
                  Authenticator, ...)
                </li>
                <li>Scan the QR code with your OTP app</li>
                <li>
                  Enter the OTP code generated by the app in the OTP field below
                </li>
                <li>
                  Click the save button. If the OTP code is correct, 2FA will be
                  enabled. Next time you login, you will be asked for the OTP
                  provided by your app.
                </li>
              </ol>
              <p>
                If you need to reset your 2FA, you can do it by clicking the
                checkbox below, disabling 2FA, and then enabling it again.
              </p>
            </Segment>
          </Segment.Group>
        </Container>
        <p></p>
        <Form
          formData={this.props.user}
          schema={this.state.schema}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          onChangeFormData={this.onChangeFormData}
          loading={this.props.updating}
        ></Form>
        {/* <pre>{JSON.stringify(this.props.user, null, 2)}</pre> */}
      </>
    ) : (
      <></>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      user: state.users.user,
      userId: state.userSession.token
        ? jwtDecode(state.userSession.token).sub
        : '',
      loaded: state.users.get.loaded,
      loading: state.users.get.loading,
      updated: state.users.update.loaded,
      updating: state.users.update.loading,
      // userschema: state.userschema,
    }),
    { getUser, updateUser },
  ),
)(Preferences);
