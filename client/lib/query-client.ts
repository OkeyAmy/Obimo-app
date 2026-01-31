import { QueryClient, QueryFunction } from "@tanstack/react-query";

export function getApiUrl(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) {
    return `https://${domain}/`;
  }
  return "http://localhost:5000/";
}

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const url = new URL(path, getApiUrl());
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url.toString(), options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  
  return response;
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const [basePath, ...params] = queryKey as string[];
  
  let path = basePath;
  if (params.length > 0 && !basePath.includes("?")) {
    path = `${basePath}?userId=${params[0]}`;
  }
  
  const url = new URL(path, getApiUrl());
  
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  
  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      queryFn: defaultQueryFn,
    },
  },
});
