/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-lines-per-function */
import { put, RxRequestInit, ContentTypeList } from '../src/index'
import { HttpbinPostResponse } from '../test/model'

import { DELAY, HOST_PUT } from './config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = '20_put.test.ts'

describe(filename, function() {
  this.retries(3)
  beforeEach(resolve => setTimeout(resolve, DELAY))

  describe('Should put() works with httpbin.org', () => {
    const url = HOST_PUT
    const initArgs = {
      contentType: ContentTypeList.formUrlencoded,
      timeout: 60 * 1000,
    } as RxRequestInit

    it('without parameter init', (done) => {
      put<HttpbinPostResponse>(url).subscribe(
        (res) => {
          assert(res && res.url === url)
          done()
        },
        (err) => {
          assert(false, err)
        },
      )
    })

    it('send key:value object data', (resolve) => {
      const pdata = {
        p1: Math.random(),
        p2: Math.random().toString(),
      }
      const args = { ...initArgs }
      args.data = { ...pdata }

      put<HttpbinPostResponse>(url, args).subscribe(
        (res) => {
          assert(res && res.url === url)

          try {
            const { form } = res
            assert(form && form.p1 === pdata.p1.toString(), `Should got "${pdata.p1}"`)
            assert(form && form.p2 === pdata.p2, `Should got "${pdata.p2}"`)
          }
          catch (ex) {
            assert(false, ex)
          }
          resolve()
        },
        (err) => {
          assert(false, err)
          resolve()
        },
      )
    })

    it('send nested key:value object data', (resolve) => {
      const pdata = {
        p1: Math.random(),
        p2: Math.random().toString(),
        p3: {
          foo: Math.random().toString(),
        },
      }
      const args = { ...initArgs }
      args.data = { ...pdata }

      put<HttpbinPostResponse>(url, args).subscribe(
        (res) => {
          assert(res && res.url === url)

          try {
            const { form } = res
            assert(form && form.p1 === pdata.p1.toString(), `Should got "${pdata.p1}"`)
            assert(form && form.p2 === pdata.p2, `Should got "${pdata.p2}"`)
            assert(form && form['p3[foo]'] === pdata.p3.foo, `Should got "${pdata.p3.foo}"`)
          }
          catch (ex) {
            assert(false, ex)
          }
          resolve()
        },
        (err) => {
          assert(false, err)
          resolve()
        },
      )
    })

    it('send form', (resolve) => {
      const pdata = new FormData()
      const p1 = Math.random()
      const p2 = Math.random().toString()
      pdata.append('p1', p1.toString())
      pdata.append('p2', p2)

      const args: RxRequestInit = {
        ...initArgs, data: pdata, processData: false, contentType: false,
      }

      put<HttpbinPostResponse>(url, args).subscribe(
        (res) => {
          assert(res && res.url === url)

          try {
            const { form } = res
            assert(form && form.p1 === p1.toString(), `Should got "${p1}"`)
            assert(form && form.p2 === p2, `Should got "${p2}"`)
          }
          catch (ex) {
            assert(false, ex)
          }
          resolve()
        },
        (err) => {
          assert(false, err)
          resolve()
        },
      )
    })
  })

})
