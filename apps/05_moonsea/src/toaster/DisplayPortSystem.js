export function DisplayPortSystem(m) {
    const displayPortRef = useElementRef('#display');
    return {
        displayPort: displayPortRef,
    };
}

export function useDisplayPort(m) {
    const displayPortSystem = useSystem(m, DisplayPortSystem);
    return displayPortSystem.displayPort;
}

export function useFrame(m, callback) {
    const displayPort = useDisplayPort(m);
    useEffect(() => {
        displayPort.addEventListener('frame', frame);
        return () => {
            displayPort.removeEventListener('frame', frame);
        };
    });
}
