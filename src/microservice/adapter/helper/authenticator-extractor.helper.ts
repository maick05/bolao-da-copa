import { JWTPayload } from '@devseeder/nestjs-microservices-core';

export class AuthenticatorExtractorHelper {
  static extractBasicAuth(authStr: string) {
    const b64auth = (authStr || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    return { username, password };
  }

  /* istanbul ignore next */
  static extractBearerTokenAuth(authStr: string): JWTPayload {
    const base64Payload = authStr.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payloadBuffer.toString());
  }
}
