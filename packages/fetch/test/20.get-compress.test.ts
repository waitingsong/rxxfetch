import {
  ab2str,
  basename,
} from '@waiting/shared-core'

import { get, Options } from '../src/index'

import { HOST } from './config'
import { HttpbinGetResponse } from './test.types'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, function() {
  this.retries(3)

  describe('Should get() for compressed response works with httpbin.org', () => {
    const initOpts = {
      timeout: 20 * 1000,
    } as Options

    it('brotli', async () => {
      const url = HOST + '/brotli'
      const opts = { ...initOpts }

      const ret = await get<HttpbinGetResponse>(url, opts)
      assert(ret && ret.brotli === true)
    })

    it('deflate', async () => {
      const url = HOST + '/deflate'
      const args = { ...initOpts }

      const ret = await get<HttpbinGetResponse>(url, args)
      assert(ret && ret.deflated === true)
    })

    it('gzip', async () => {
      const url = HOST + '/gzip'
      const args = { ...initOpts }

      const ret = await get<HttpbinGetResponse>(url, args)
      assert(ret && ret.gzipped === true)
    })
  })

})

