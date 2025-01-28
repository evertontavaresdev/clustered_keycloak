# Clustered Keycloak

## Running locally

The `docker-compose.yaml` file contains a Keycloak cluster configuration with three instances, connected to a PostgreSQL database and fronted by a Traefik load balancer.
You can use this configuration to run the cluster locally for testing purposes.

First, bind the `keycloak.localhost` domain to the local address:

```bash
echo "127.0.0.1 keycloak.localhost" >> /etc/hosts
```

Start the cluster with docker-compose:

```bash
docker-compose up -d
```

## Deploying

### Building the Docker Image

Build the custom Keycloak image using:

```bash
docker build -t keycloak-cluster:latest .
```

You can also tag the image with a specific version:

```bash
docker build -t keycloak-cluster:1.0.0 .
```

### Deploying to AWS ECR

1. Authenticate to your AWS account using the AWS CLI:

```bash
aws configure
```

2. Login to Amazon ECR:

```bash
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
```

3. Create an ECR repository (if not already created):

```bash
aws ecr create-repository --repository-name keycloak-cluster
```

4. Tag your Docker image for ECR:

```bash
docker tag keycloak-cluster:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/keycloak-cluster:latest
```

5. Push the image to ECR:

```bash
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/keycloak-cluster:latest
```

Replace the following placeholders with your actual values:
- `YOUR_REGION`: Your AWS region (e.g., us-east-1)
- `YOUR_ACCOUNT_ID`: Your 12-digit AWS account ID

## Load testing

The load testing setup uses K6 (https://k6.io/)

To run the tests locally:

```bash
export KC_HOST="https://keycloak.localhost"
export KC_REALM="teste"
export CLIENT_ID="load-test"
export CLIENT_SECRET="???" 

k6 run k6/call.js --insecure-skip-tls-verify
```