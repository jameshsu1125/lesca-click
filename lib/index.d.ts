export declare let dataset: Record<string, (event: TouchEvent | MouseEvent) => void>;
export declare const add: (query: string, callback: (event: TouchEvent | MouseEvent) => void) => void;
export declare const remove: (query: string) => void;
export declare const install: (app?: string) => void;
export declare const clear: () => void;
export declare const addPreventExcept: (query: string | string[]) => void;
export declare const setPreventDefault: (value: boolean) => void;
export declare const setEnabled: (value: boolean) => void;
declare const Click: {
    install: (app?: string) => void;
    dataset: Record<string, (event: TouchEvent | MouseEvent) => void>;
    addPreventExcept: (query: string | string[]) => void;
    setPreventDefault: (value: boolean) => void;
    add: (query: string, callback: (event: TouchEvent | MouseEvent) => void) => void;
    clear: () => void;
    remove: (query: string) => void;
    setEnabled: (value: boolean) => void;
};
export default Click;
