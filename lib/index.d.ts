export declare let dataset: any;
export declare let enabled: boolean;
export declare const add: (query: string, callback: Function) => void;
export declare const remove: (query: string) => void;
export declare const install: (app?: string) => void;
export declare const clear: () => void;
export declare const addPreventExcept: (query: string | string[]) => void;
export declare const setPreventDefault: (value: boolean) => void;
declare const Click: {
    install: (app?: string) => void;
    dataset: any;
    addPreventExcept: (query: string | string[]) => void;
    setPreventDefault: (value: boolean) => void;
    add: (query: string, callback: Function) => void;
    clear: () => void;
    remove: (query: string) => void;
    enabled: boolean;
};
export default Click;
