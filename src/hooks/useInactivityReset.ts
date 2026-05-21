import { useEffect, useRef, useCallback } from "react";

const DEFAULT_EVENTS = [
    'mousemove', 'mousedown', 'keydown',
    'touchstart', 'touchmove', 'click', 'scroll'
]

export function useInactivityReset(
    delay = 5 * 60 * 1000,
    onInactive: () => void,
    events = DEFAULT_EVENTS
){
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const hasInteracted = useRef(false);

    const clearTimers = useCallback(() => {
        clearTimeout(inactivityTimer.current);
    }, []);

    const resetTimer = useCallback(() => {
        hasInteracted.current = true;
        
        clearTimers();

        inactivityTimer.current = setTimeout(() => {
            if (!hasInteracted.current) {
                return;
            }
            onInactive();
        }, delay);
    }, [clearTimers, onInactive, delay]);

    useEffect(() => {
        events.forEach(event => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        return () => {
            clearTimers();
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer, events, clearTimers]);

    return { resetTimer };
}
