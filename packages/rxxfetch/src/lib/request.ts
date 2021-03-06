/* eslint-disable @typescript-eslint/no-unsafe-return */
import { defer, of, throwError, Observable } from 'rxjs'
import { catchError, concatMap, timeout } from 'rxjs/operators'

import { parseRespCookie } from './response'
import { Args, FetchResult } from './types'
import {
  parseInitOpts,
  selectFecthModule,
  parseRequestGetLikeData,
  parseRequestPostLikeData,
} from './util'


/**
 * fetch wrapper
 *
 * parameter init ignored during parameter input is typeof Request
 */
export function _fetch(
  input: Request | string,
  args: Args,
  requestInit: RequestInit,
): FetchResult<Response> {

  /* istanbul ignore else */
  if (! input) {
    throwError(() => new TypeError('value of input invalid'))
  }

  let req$ = createObbRequest(input, args, requestInit)
  req$ = parseRequestStream(req$, args)

  return req$.pipe(
    concatMap(res => handleRedirect(res, args, requestInit)),
  )
}


/** Create Observable Request */
export function createObbRequest(
  input: Request | string,
  args: Args,
  requestInit: RequestInit,
): FetchResult<Response> {

  let inputNew = input
  const fetchModule = selectFecthModule(args.fetchModule)

  if (typeof input === 'string') {

    if (['GET', 'DELETE'].includes(requestInit.method as string)) {
      inputNew = parseRequestGetLikeData(input, args)
    }
    else if (['POST', 'PUT', 'OPTIONS'].includes(requestInit.method as string)) {
      const body: NonNullable<RequestInit['body']> | undefined = parseRequestPostLikeData(args)
      if (typeof body !== 'undefined') {
        requestInit.body = body
      }
    }
    else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new TypeError(`Invalid method value: "${requestInit.method}"`)
    }

    return defer(() => fetchModule(inputNew, requestInit))
  }
  else {
    return defer(() => fetchModule(input))
  }
}

export function parseRequestStream(
  request$: Observable<Response>,
  args: Args,
): FetchResult<Response> {

  const req$ = parseTimeout(request$, args.timeout, args.abortController)
  return req$
}


function parseTimeout(
  request$: Observable<Response>,
  timeoutValue: Args['timeout'],
  abortController: Args['abortController'],
): FetchResult<Response> {

  let ret$ = request$

  /* istanbul ignore else */
  if (typeof timeoutValue === 'number' && timeoutValue >= 0) {
    ret$ = request$.pipe(
      timeout(timeoutValue),
      catchError((err) => {
        // test by test_browser/30_abort.test.ts
        // eslint-disable-next-line @typescript-eslint/unbound-method
        if (abortController && typeof abortController.abort === 'function' && ! abortController.signal.aborted) {
          abortController.abort()
        }
        throw err
      }),
    )
  }

  return ret$
}


/**
 * Handle redirect case to retrieve cookies before jumping under Node.js.
 * There's no effect under Browser
 *
 * docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export function handleRedirect(
  resp: Response,
  args: Args,
  init: RequestInit,
): FetchResult<Response> {

  // test by test/30_cookie.test.ts
  /* istanbul ignore next */
  if (args.keepRedirectCookies === true && resp.status >= 301 && resp.status <= 308) {
    const url = resp.headers.get('location')
    const cookie = resp.headers.get('Set-Cookie')

    /* istanbul ignore if */
    if (url) {
      const cookieObj = parseRespCookie(cookie)
      /* istanbul ignore else */
      if (cookieObj) {
        args.cookies = args.cookies
          ? { ...args.cookies, ...cookieObj }
          : { ...cookieObj }
      }
      const options = parseInitOpts({ args, requestInit: init })

      if (resp.status === 303) {
        options.requestInit.method = 'GET'
        return _fetch(url, options.args, options.requestInit)
      }
      else {
        return _fetch(url, options.args, options.requestInit)
      }
    }
  }
  else {
    throwError(() => 'Redirect location is empty')
  }

  return of(resp)
}
