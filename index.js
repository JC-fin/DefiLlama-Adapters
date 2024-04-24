const BigNumber = require('bignumber.js');

const BRIDGE_CONTRACT = '0xAB13B8eecf5AA2460841d75da5d5D861fD5B8A39';
const tBTC_CONTRACT = '0x18084fbA666a33d37592fA2633fD49a74DD93a88'; 
const wBTC_CONTRACT = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'; 

async function tvl(timestamp, block, chainBlocks, { api }) {
  const balances = {};

  // Fetch tBTC balance from the bridge contract
  const tBTCBalance = await api.call({
    abi: 'erc20:balanceOf',
    target: tBTC_CONTRACT,
    params: [BRIDGE_CONTRACT],
    block: chainBlocks.ethereum,
    chain: 'ethereum'
  });

  // Add tBTC balance to balances
  api.add(tBTC_CONTRACT, tBTCBalance);

  // Fetch wBTC balance from the bridge contract
  const wBTCBalanceRaw = await api.call({
    abi: 'erc20:balanceOf',
    target: wBTC_CONTRACT,
    params: [BRIDGE_CONTRACT],
    block: chainBlocks.ethereum,
    chain: 'ethereum'
  });

  // Normalize wBTC balance to 18 decimals
  const wBTCBalanceNormalized = new BigNumber(wBTCBalanceRaw).times(new BigNumber(10).pow(10)).toString();

  // Add normalized wBTC balance to balances
  api.add(wBTC_CONTRACT, wBTCBalanceNormalized);

  console.log('Balances:', balances);

  return balances;
}

module.exports = {
  timetravel: true,
  misrepresentedTokens: false,
  methodology: 'Counts the balance of tBTC and wBTC tokens in the bridge contract.',
  start: 19425763, 
  ethereum: { tvl }
};

