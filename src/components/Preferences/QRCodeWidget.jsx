import { useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { QRCodeSVG } from 'qrcode.react';
import { encode } from 'hi-base32';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import { FormFieldWrapper } from '@plone/volto/components';

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
}) => {
  const userId = useSelector((state) =>
    state.userSession.token ? jwtDecode(state.userSession.token).sub : '',
  );
  const [secret, setSecret] = useState();
  const site_title = useSelector((state) =>
    state.site.data['plone.site_title']
  );

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
            value={`otpauth://totp/${userId}@${window.location.hostname}?secret=${secret}&issuer=${site_title}`}
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

export default QRCodeWidget;
