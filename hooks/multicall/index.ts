import { BigNumber } from 'ethers/lib/ethers';

export * from './useMultipleContractSingleData';

type MethodArg = string | number | BigNumber;
type MethodArgs = Array<MethodArg | MethodArg[]>;

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

export interface Call {
  address: string;
  callData: string;
}

type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined>
  | undefined;

interface CallState {
  readonly valid: boolean;
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined;
  // true if the result has never been fetched
  readonly loading: boolean;
  // true if the result is not for the latest block
  readonly syncing: boolean;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
}

function isMethodArg(x: unknown): x is MethodArg {
  return ['string', 'number'].indexOf(typeof x) !== -1;
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) &&
      x.every(
        (xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))
      ))
  );
}
