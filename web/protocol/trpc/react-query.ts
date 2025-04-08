import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";
import { transformer } from "./transformer";

const TANSTACK_QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
    dehydrate: {
      serializeData: transformer.serialize,
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
    hydrate: {
      deserializeData: transformer.deserialize,
    },
  },
};

export function makeQueryClient() {
  return new QueryClient(TANSTACK_QUERY_CONFIG);
}
