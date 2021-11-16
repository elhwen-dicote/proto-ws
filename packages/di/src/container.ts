import { getConstructorArgs } from "./decorators-utils";
import { InjectionToken, Constructor } from "./types";
import { ClassProvider, isClassProvider } from "./types/class-provider.type";
import { isConstructor } from "./types/constructor.type";
import { isInjectionToken } from "./types/injection-token.type";
import { Provider } from "./types/provider.type";

interface ProviderEntry<T = unknown> {
    readonly provide: InjectionToken<T>;
    readonly dependencies: InjectionToken<unknown>[];
    instance?: T;
    buildInstance(...dependencies: unknown[]): T;
}

class ClassProviderEntry<T = unknown> implements ProviderEntry<T> {

    public readonly provide: InjectionToken<T>;
    public readonly useClass: Constructor<T>;

    private _dependencies?: InjectionToken<unknown>[];
    private _instance?: T;

    constructor({ provide, useClass }: ClassProvider<T>) {
        this.provide = provide;
        this.useClass = useClass;
    }

    get dependencies() {
        return (this._dependencies ??= getConstructorArgs(this.useClass));
    }

    get instance() {
        return this._instance;
    }

    buildInstance(dependencies: unknown[]): T {
        return (this._instance = new this.useClass(...dependencies));
    }
}

export class Container {

    private readonly bindings = new Map<InjectionToken, ProviderEntry>();

    constructor(
        private readonly parent?: Container,
    ) { }

    register(constructor: Constructor): void;
    register(token: InjectionToken, provider: Provider): void;
    register(token: Constructor | InjectionToken, provider?: Provider) {
        let providerEntry;
        if (isConstructor(token) && !provider) {
            providerEntry = new ClassProviderEntry({ provide: token, useClass: token });
        } else if (isClassProvider(provider)) {
            providerEntry = new ClassProviderEntry(provider);
        } else {
            throw new Error("unknown provider");
        }
        if (isInjectionToken(token)) {
            this.bindings.set(token, providerEntry);
        } else throw new Error("unknown token");
    }

    get<T>(token: InjectionToken<T>) {
        let instance: unknown;
        const entry = this.bindings.get(token);
        if (!entry) {
            if (!this.parent) {
                throw new Error("unknown token");
            } else {
                instance = this.parent.get<T>(token);
            }
        } else {
            instance = entry.instance;
            if (!instance) {
                const dependencies = entry.dependencies.map(
                    (dependency) => this.get(dependency));
                instance = entry.buildInstance(dependencies);
            }
        }
        return instance as T;
    }

}