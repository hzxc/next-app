import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abis/bsc';
import { bscProvider } from 'conf';
import {
  bscBusdAddr,
  bscCakeAddr,
  bscPancakeRouterAddr,
  bscWBnbAddr,
} from 'data/constants';
import { ethers, utils } from 'ethers';
import { TradeDirection } from 'simple-uniswap-sdk';
import { BestRouteQuotes } from 'simple-uniswap-sdk/dist/esm/factories/router/models/best-route-quotes';
import { pancakeBestPath } from 'utils/path';
import invariant from 'tiny-invariant';

const router = new ethers.Contract(
  bscPancakeRouterAddr,
  PancakeRouterABI,
  bscProvider
);

interface BestPathResp {
  routeText?: string;
  routePathArray?: string[];
}

export const useBscBestPath = (param: {
  fromToken: string;
  toToken: string;
  amountToTrade: string;
  direction: TradeDirection;
}) => {
  return useQuery<BestPathResp, Error>(['BscBestPath', param], async () => {
    console.log(param);
    invariant(
      param.fromToken.length >= 40 && param.toToken.length >= 40,
      'useBscBestPath param error!'
    );

    if (param.fromToken === ethers.constants.AddressZero) {
      param.fromToken = bscWBnbAddr;
    }
    if (param.toToken === ethers.constants.AddressZero) {
      param.toToken = bscWBnbAddr;
    }

    if (param.amountToTrade === '') {
      return {
        routeText: '',
        routePathArray: [],
      };
    } else {
      const ret = await pancakeBestPath(
        param.fromToken,
        param.toToken,
        param.amountToTrade,
        param.direction
      );
      return {
        routeText: ret.bestRouteQuote.routeText,
        routePathArray: ret.bestRouteQuote.routePathArray,
      };
    }
  });
};
