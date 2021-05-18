/* eslint-disable node/no-unpublished-import */
import { Options } from '@waiting/fetch'
import type { Context } from 'egg'


export interface FetchComponentConfig {
  /**
   * Generate headersInit from request context for Fetch request
   *
   * @default customGenReqHeadersInit()
   */
  genRequestHeaders: (
    ctx: Context,
    headersInit?: Record<string, string>,
  ) => Headers
  /**
   * Callback before request
   */
  beforeRequest?: (options: ReqCallbackOptions) => Promise<void>
  /**
   * Callback after response
   */
  afterResponse?: <T = unknown>(options: RespCallbackOptions<T>) => Promise<void>
  isTraceLoggingReqBody?: boolean
  isTraceLoggingRespData?: boolean
}

export interface ReqCallbackOptions {
  ctx: Context
  isTraceLoggingReqBody: boolean
  opts: Options
}

export interface RespCallbackOptions <T = unknown> {
  ctx: Context
  isTraceLoggingRespData: boolean
  opts: Options
  resultData: T
}

