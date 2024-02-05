import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'

function defaultRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  return config
}

function defaultResponseInterceptor(response: AxiosResponse): AxiosResponse {
  return response
}

function errorResponseInterceptor(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

export const ApiInstance = axios.create()

ApiInstance.interceptors.request.use(defaultRequestInterceptor)
ApiInstance.interceptors.response.use(
  defaultResponseInterceptor,
  errorResponseInterceptor
)
