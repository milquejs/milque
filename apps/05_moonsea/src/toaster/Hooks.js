
export function useInterval(m, callback, timeout) {
    useEffect(m, () => {
        let handle = setInterval(() => {
            let now = performance.now();
            callback(now);
        }, timeout);
        return () => {
            clearInterval(handle);
        };
    });
}
