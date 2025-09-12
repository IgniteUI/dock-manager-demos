export type Breakpoint = 'lg' | 'md' | 'sm';

export type BreakpointChangeDetail = {
    previous: Breakpoint;
    current: Breakpoint;
};

export const BP_MD = 950;
export const BP_LG = 1280;

// Initialize CSS variables once (numeric, no units)
export function setBreakpointCssVars(): void {
    const root = document.documentElement;
    root.style.setProperty('--bp-md', String(BP_MD));
    root.style.setProperty('--bp-lg', String(BP_LG));
}

// Compute helper using the shared constants
function computeBreakpoint(width: number): Breakpoint {
    if (width >= BP_LG) return 'lg';
    if (width >= BP_MD) return 'md';
    return 'sm';
}

class ResponsiveService {
    private _current: Breakpoint;
    private listeners = new Set<(detail: BreakpointChangeDetail) => void>();

    private mqMd: MediaQueryList;
    private mqLg: MediaQueryList;

    constructor() {
        // One place defines CSS vars for thresholds
        setBreakpointCssVars();

        // Set up media queries at once
        this.mqMd = window.matchMedia(`(min-width: ${BP_MD}px)`);
        this.mqLg = window.matchMedia(`(min-width: ${BP_LG}px)`);

        // Initial breakpoint using MQs (no layout read)
        this._current = this.pickFromMediaQueries();

        // Listen only to threshold crossings (no resize debounce needed)
        this.onMediaChange = this.onMediaChange.bind(this);
        this.mqMd.addEventListener('change', this.onMediaChange);
        this.mqLg.addEventListener('change', this.onMediaChange);

        // Optional: also set a CSS var with the current bp name
        document.documentElement.style.setProperty('--bp-name', this._current);
    }

    public get current(): Breakpoint {
        return this._current;
    }

    // Keep existing API so callers can compute from an arbitrary width if needed
    public compute(width: number): Breakpoint {
        return computeBreakpoint(width);
    }

    public addListener(cb: (d: BreakpointChangeDetail) => void): () => void {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    private onMediaChange() {
        const next = this.pickFromMediaQueries();
        if (next === this._current) return;

        const prev = this._current;
        this._current = next;

        // Keep the single CSS prop for current breakpoint name (as you requested)
        document.documentElement.style.setProperty('--bp-name', next);

        const detail: BreakpointChangeDetail = { previous: prev, current: next };
        this.listeners.forEach(cb => {
            try { cb(detail); } catch (e) { console.warn('responsive listener error:', e); }
        });

        const ev = new CustomEvent<BreakpointChangeDetail>('app-viewport-breakpoint-change', {
            detail,
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(ev);
    }

    // Derive current breakpoint from MQ state (no layout reads)
    private pickFromMediaQueries(): Breakpoint {
        // Order matters: check largest first
        if (this.mqLg.matches) return 'lg';
        if (this.mqMd.matches) return 'md';
        return 'sm';
    }
}

export const responsiveService = new ResponsiveService();
