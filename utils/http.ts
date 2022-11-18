import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { useCallback } from 'react';
interface Config extends AxiosRequestConfig<object> {
  token?: string;
}

export const http = (
  url: string,
  { data, token, headers, ...restonfig }: Config = {}
) => {
  const config = {
    url: url,
    method: 'get',
    // headers: {
    //   Authorization: token ? `Bearer ${token}` : '',
    //   'Content-Type': data ? 'application/json' : '',
    // },
    data,
    ...restonfig,
  };

  if (config.method.toLowerCase() === 'get') {
    if (data) {
      config.url += `?${qs.stringify(data)}`;
      config.data = undefined;
    }
  }

  return axios(config).then(async (response) => {
    if (response.status === 401) {
      return Promise.reject({ message: response.statusText });
    }

    return response.data;
  });
};

export const useHttp = () => {
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config }),
    []
  );
};
