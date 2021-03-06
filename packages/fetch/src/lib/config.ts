import { patchedFetch, Node_Headers } from './patch'
import { Options } from './types'


export const initialOptions: Options = {
  url: '',
  dataType: 'json',
  keepRedirectCookies: false,
  method: 'GET',
  processData: true,
  timeout: Infinity,

  cache: 'default',
  credentials: 'same-origin',
  mode: 'cors',
  redirect: 'follow',
  referrer: 'client',
}

// for non-browser, like node.js
if (typeof window === 'undefined') {
  if (typeof fetch !== 'function') {
    initialOptions.fetchModule = patchedFetch
  }
  if (typeof Headers !== 'function') {
    initialOptions.headersInitClass = Node_Headers
  }
}

