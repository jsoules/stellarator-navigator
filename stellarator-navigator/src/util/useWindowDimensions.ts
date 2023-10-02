// adapted from mcmc-monitor & https://stackoverflow.com/a/75101934/6131076
import { RefObject, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        return subscribe(handleResize)
    }, []);

    return windowDimensions;
}


export const useDimensions = (ref: RefObject<HTMLElement>) => {
    console.log(`Calling useDimensions hook with ref target ${ref.current}`)
    const dimensions = useSyncExternalStore(
        subscribe,
        () => JSON.stringify({width: ref.current?.offsetWidth ?? 0,
                              height: ref.current?.offsetHeight ?? 0})
    )
    return useMemo(() => JSON.parse(dimensions), [dimensions])
}


const subscribe = (callback: (e: Event) => void) => {    
    window.addEventListener("resize", callback)
    return () => window.removeEventListener("resize", callback)
}

export default useWindowDimensions