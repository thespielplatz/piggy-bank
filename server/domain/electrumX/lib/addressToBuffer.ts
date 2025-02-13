import * as bitcoinjs from 'bitcoinjs-lib'

export const addressToBuffer = (address: string): Buffer | null => {
  let payment: bitcoinjs.payments.Payment
  try {
    if (address.substring(0, 4) === 'bc1q') {
      payment = bitcoinjs.payments.p2wpkh({ address })
    } else if (address.substring(0, 4) === 'tb1q') {
      payment = bitcoinjs.payments.p2wpkh({ address, network: bitcoinjs.networks.testnet })
    } else {
      console.error('addressToBuffer invalid address:', { address })
      return null
    }
  } catch (error) {
    console.error('addressToBuffer unknown error:', { error, address })
    return null
  }

  try {
    if (payment.output == null) {
      console.error('addressToBuffer unable to generate buffer from address:', { address })
      return null
    }
    return payment.output
  } catch (error) {
    console.error('addressToBuffer unknown error:', { error, address })
    return null
  }
}
