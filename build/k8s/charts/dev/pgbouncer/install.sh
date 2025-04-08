set -e

helm repo add icoretech https://icoretech.github.io/helm
helm repo update

kubectl apply -f namespace.yaml

helm upgrade --install pgbouncer icoretech/pgbouncer --namespace calendee-dev --version 2.1.1 -f values.yaml

