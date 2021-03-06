import { basename } from '@waiting/shared-core'

import { fetch, RxRequestInit } from '../src/index'

import { HOST, HOST_GET } from './config'

// eslint-disable-next-line import/order
import assert = require('power-assert')



const filename = basename(__filename)

describe(filename, () => {
  describe('Should rxfetch() throw error with invalid input', () => {
    const initArgs = {
      dataType: 'text',
    } as RxRequestInit

    it('with blank string', (resolve) => {
      const args = { ...initArgs }

      fetch('', args).subscribe(
        () => {
          assert(false, 'Should throw error but NOT')
        },
        () => {
          assert(true)
          resolve()
        },
      )
    })

    it('with null', (resolve) => {
      const args = { ...initArgs }

      // @ts-ignore
      fetch(null, args).subscribe(
        () => {
          assert(false, 'Should throw error but NOT')
        },
        () => {
          assert(true)
          resolve()
        },
      )
    })

    it('with undefined', (resolve) => {
      const args = { ...initArgs }

      // @ts-ignore
      fetch(undefined, args).subscribe(
        () => {
          assert(false, 'Should throw error but NOT')
        },
        () => {
          assert(true)
          resolve()
        },
      )
    })

  })


  describe('Should rxfetch() throw error with invalid parameter init', () => {
    const url = HOST_GET
    const initArgs = {
      dataType: 'text',
    } as RxRequestInit
    initArgs.fetchModule = void 0

    it('with invalid fetchModule', (resolve) => {
      const args = { ...initArgs }
      // @ts-ignore
      args.fetchModule = 'should Function'

      fetch(url, args).subscribe(
        () => {
          assert(false, 'Should throw error but NOT')
        },
        () => {
          assert(true)
          resolve()
        },
      )
    })
  })

})
