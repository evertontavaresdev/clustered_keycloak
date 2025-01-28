import http from 'k6/http';
import { sleep, check } from 'k6';
import { parseHTML } from 'k6/html';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';

export let options = {
  vus: 100,
  iterations: 10000,
  duration: "1h",
};

let config = {
    host: __ENV.KC_HOST,
    realm: __ENV.KC_REALM,
    client_id: __ENV.CLIENT_ID,
    client_secret: __ENV.CLIENT_SECRET,
    redirect_uri: 'http://localhost:8080?sso=false'
}

export default function () {

  const res = http.get(`${config.host}/realms/${config.realm}/protocol/openid-connect/auth?response_type=code&client_id=${config.client_id}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&login=true&prompt=login&scope=openid`);
  const doc = parseHTML(res.body);
  const actionUrl = doc.find('#kc-form-login').attr('action');

  const loginData = {
    username: "teste",
    password: "teste",
    credentialId: '',
  };
  const resLogin = http.post(actionUrl, loginData, { redirects: 0 });

  const codeRedirectUrl = new URL(resLogin.headers.Location);

  const data = {
    grant_type: 'authorization_code',
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: codeRedirectUrl.searchParams.get('code'),
    redirect_uri: config.redirect_uri
  };

  const resToken = http.post(`${config.host}/realms/${config.realm}/protocol/openid-connect/token`, data);

  check(resToken, {
    'is status 200': (r) => r.status === 200,
    'has JWT access token': (r) => r.json().access_token.length > 0,
    'has JWT refresh token': (r) => r.json().refresh_token.length > 0,
  });

  sleep(5);
}