import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { QRCodeSVG } from 'qrcode.react';
import { encode } from 'hi-base32';
import { FormFieldWrapper } from '@plone/volto/components';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { compose } from 'redux';

export const QRCodeWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  onChange,
  onEdit,
  onDelete,
  intl,
  userId,
}) => {
  const [secret, setSecret] = React.useState();

  useEffect(() => {
    const secret = encode(Math.random().toString(36))
      .toString()
      .substring(0, 16);
    onChange(id, secret);
    setSecret(secret);
  }, [id, onChange]);

  return (
    <Form.Field
      inline
      required={required}
      className={description ? 'help' : ''}
    >
      <FormFieldWrapper id={id} description={description}>
        <div>
          {/* TODO: user + domain + issuer 
            oppure fare generare il valore del qr code dal server
        */}
          <QRCodeSVG
            size={200}
            value={`otpauth://totp/${userId}@${window.location.hostname}?secret=${secret}`}
          />
          <input
            type="hidden"
            value={secret}
            id={`field-${id}`}
            name={id}
            onChange={onChange}
          />
        </div>
      </FormFieldWrapper>
    </Form.Field>
  );
};

export default compose(
  injectIntl,
  connect((state, props) => ({
    userId: state.userSession.token
      ? jwtDecode(state.userSession.token).sub
      : '',
  })),
)(QRCodeWidget);
