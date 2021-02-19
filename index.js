const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'; // DAI
const PRIVATE_KEY = '305378d1de2e37fe1100464afbc1acc9cfc91edf1a226e07544d6ebe2bfbc250';

const init = async() => {
  const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai, weth);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
  console.log(route);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent('50', '10000') //50 bips 1 bip = 0.01
  const ammountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // the min amount of DAI to buy
  const path = [weth.address, dai.address];
  const to = '';
  const deadline = Math.floor(Date.now() / 1000 ) + 60 * 20;
  const value = trade.inputAmount.raw;

  const provider = ethers.getDefaultProvider('mainnet', {
    infura: 'https://mainnet.infura.io/v3/ba14d1b3cfe5405088ee3c65ebd1d4db'
  })
  
  const signer = new ethers.Wallet(PRIVATE_KEY);
  const account = signer.connect(provider);
  const uniswap = new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ['function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);'],
    account
  );
  
  const tx = await uniswap.sendExactETHForTokens(
    ammountOutMin,
    path,
    to,
    deadline,
    { value, gasPrice: 20e9 }
  );
  console.log(`Transaction hash: ${tx.hash}`);
  
  const receipt = await tx.await();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
  
}


init();