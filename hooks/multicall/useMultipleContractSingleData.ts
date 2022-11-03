import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useMemo } from 'react';

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions
): CallState[] {
  const fragment = useMemo(
    () => contractInterface.getFunction(methodName),
    [contractInterface, methodName]
  );
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment]
  );

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                }
              : undefined;
          })
        : [],
    [addresses, callData, fragment]
  );

  const results = useCallsData(calls, options);
  const { chainId } = useActiveWeb3React();

  const { cache } = useSWRConfig();

  return useMemo(() => {
    const currentBlockNumber = cache.get(
      unstable_serialize(['blockNumber', chainId])
    );
    return results.map((result) =>
      toCallState(result, contractInterface, fragment, currentBlockNumber)
    );
  }, [cache, chainId, results, contractInterface, fragment]);
}
