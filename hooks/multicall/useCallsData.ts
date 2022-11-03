import { useAccount } from "wagmi";
import { Call } from ".";

export const useCallsData = async (
  calls: (Call | undefined)[],
  options?: ListenerOptions
): CallResult[] {
  const { connector } = useAccount();
  const chainId = await connector?.getChainId()

  const callResults = useSelector<
    AppState,
    AppState['multicall']['callResults']
  >((state) => state.multicall.callResults);
  const dispatch = useAppDispatch();

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? []
      ),
    [calls]
  );

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys);
    if (!chainId || callKeys.length === 0) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const calls = callKeys.map((key) => parseCallKey(key));
    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options,
      })
    );

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options,
        })
      );
    };
  }, [chainId, dispatch, options, serializedCallKeys]);

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT;

        const result = callResults[chainId]?.[toCallKey(call)];
        let data;
        if (result?.data && result?.data !== '0x') {
          // eslint-disable-next-line prefer-destructuring
          data = result.data;
        }

        return { valid: true, data, blockNumber: result?.blockNumber };
      }),
    [callResults, calls, chainId]
  );
}
