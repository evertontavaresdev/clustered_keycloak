export KC_HOST="https://keycloak.localhost"
export KC_REALM="teste"
export CLIENT_ID="load-test"
export CLIENT_SECRET="QMFvwNgiaVecs4BxGh2TVpj1RWXc04C3" 

k6 run call.js --insecure-skip-tls-verify