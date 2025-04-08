PROJECT_NAME := ${PROJECT_NAME}
SECRET_KEY := ${SECRET_KEY}
PROJECT_ENV := ${PROJECT_ENV}
LANGFUSE_PUBLIC_KEY := ${LANGFUSE_PUBLIC_KEY}
LANGFUSE_SECRET_KEY := ${LANGFUSE_SECRET_KEY}
QDRANT_API_KEY := ${QDRANT_API_KEY}
API_DOMAIN := ${API_DOMAIN}

deploy-api-manifest:
	mkdir -p build/.k8s/tmp/base
	mkdir -p build/.k8s/tmp/${PROJECT_ENV}
	mkdir -p build/.k8s/final
	for dir in base ${PROJECT_ENV}; do \
		for yamlFile in build/k8s/api/$${dir}/*.yaml; do \
			envsubst <"$${yamlFile}" >"build/.k8s/tmp/$${dir}/$$(basename "$${yamlFile}")"; \
		done \
	done

	kustomize build \
        --output="build/.k8s/final" \
        "build/.k8s/tmp/${PROJECT_ENV}"
	
deploy-api-apply:
	kubectl apply -f build/.k8s/final --namespace=${PROJECT_NAME}-${PROJECT_ENV}
	kubectl --namespace=${PROJECT_NAME}-${PROJECT_ENV} --timeout=60m rollout status deploy ${PROJECT_NAME}-api


deploy-web-manifest:
	mkdir -p build/.k8s/tmp/base
	mkdir -p build/.k8s/tmp/${PROJECT_ENV}
	mkdir -p build/.k8s/final
	for dir in base ${PROJECT_ENV}; do \
		for yamlFile in build/k8s/web/$${dir}/*.yaml; do \
			envsubst <"$${yamlFile}" >"build/.k8s/tmp/$${dir}/$$(basename "$${yamlFile}")"; \
		done \
	done

	kustomize build \
        --output="build/.k8s/final" \
        "build/.k8s/tmp/${PROJECT_ENV}"


deploy-web-apply:
	kubectl apply -f build/.k8s/final --namespace=${PROJECT_NAME}-${PROJECT_ENV}
	kubectl --namespace=${PROJECT_NAME}-${PROJECT_ENV} --timeout=60m rollout status deploy ${PROJECT_NAME}-web
