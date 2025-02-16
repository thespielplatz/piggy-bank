export const PROTOCOL_METHOD = {
  SERVER: {
    VERSION: 'server.version' as const,
  },
  BLOCKCHAIN: {
    SCRIPTHASH: {
      GET_BALANCE: 'blockchain.scripthash.get_balance' as const,
      SUBSCRIBE: 'blockchain.scripthash.subscribe' as const,
    },
  },
}
