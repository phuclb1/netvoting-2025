set -e

helm repo add bitnami https://charts.bitnami.com/bitnami

helm repo update

kubectl apply -f namespace.yaml

echo "Installing Redis..."
helm upgrade --install redis bitnami/redis --version 18.4.0 -n calendee-qa -f values.yaml
