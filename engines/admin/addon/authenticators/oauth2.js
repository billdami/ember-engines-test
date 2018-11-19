import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import RSVP from 'rsvp';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import { makeArray } from '@ember/array';
import { assign } from '@ember/polyfills';

export default OAuth2PasswordGrant.extend({
    authenticate(identification, password, scope = [], headers = {}) {
        return new RSVP.Promise((resolve, reject) => {
          const data = { client_id: 'admin', 'grant_type': 'password', username: identification, password };
          const serverTokenEndpoint = this.get('serverTokenEndpoint');
          const useResponse = this.get('rejectWithResponse');
          const scopesString = makeArray(scope).join(' ');
          if (!isEmpty(scopesString)) {
            data.scope = scopesString;
          }
          this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
            run(() => {
              if (!this._validate(response)) {
                reject('access_token is missing in server response');
              }

              const expiresAt = this._absolutizeExpirationTime(response['expires_in']);
              this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
              if (!isEmpty(expiresAt)) {
                response = assign(response, { 'expires_at': expiresAt });
              }

              resolve(response);
            });
          }, (response) => {
            run(null, reject, useResponse ? response : (response.responseJSON || response.responseText));
          });
        });
      },
});
