import { getConstructorArgs } from "./decorators-utils";
import {
    InjectionToken,
    isInjectionToken,
    Constructor,
    isConstructor,
    Provider,
    ClassProvider,
    isClassProvider,
    ValueProvider,
    isValueProvider,
    FactoryProvider,
    isFactoryProvider
} from "./types";

interface ProviderEntry<T = unknown> {
    readonly provide: InjectionToken<T>;
    readonly instance: T;
}

class ClassProviderEntry<T = unknown> implements ProviderEntry<T> {

    public readonly provide: InjectionToken<T>;

    private _dependencies: InjectionToken<unknown>[];
    private _factory: () => T;
    private _instance?: T;

    constructor(
        { provide, useClass }: ClassProvider<T>,
        container: Container) {
        this.provide = provide;
        this._dependencies = getConstructorArgs(useClass = useClass);
        this._factory = () => {
            return new useClass(...this._dependencies.map(
                (token) => container.get(token)));
        };
    }

    get instance() {
        return (this._instance ??= this._factory());
    }

}

class FactoryProviderEntry<T = unknown> implements ProviderEntry<T> {

    public readonly provide: InjectionToken<T>;

    private _factory: () => T;
    private _instance?: T;

    constructor(
        { provide, useFactory, inject }: FactoryProvider<T>,
        container: Container,
    ) {
        this.provide = provide;
        this._factory = () => {
            return useFactory(...(inject ?? []).map(
                (token) => container.get(token)));
        };
    }

    get instance() {
        return (this._instance ??= this._factory());
    }

}

class ValueProviderEntry<T = unknown> implements ProviderEntry<T> {

    public readonly provide: InjectionToken<T>;
    public readonly instance: T;

    constructor(
        { provide, useValue }: ValueProvider<T>
    ) {
        this.provide = provide;
        this.instance = useValue;
    }
}


export class Container {

    private readonly bindings = new Map<InjectionToken, ProviderEntry>();

    constructor(
        private readonly parent?: Container,
    ) { }

    register<T>(provider: Constructor<T> | Provider<T>) {
        let providerEntry: ProviderEntry<T>;
        let token: InjectionToken<T>;

        if (isConstructor(provider)) {
            providerEntry = this.createProviderEntry(provider);
            token = provider;

        } else if (isInjectionToken(provider.provide)) {
            providerEntry = this.createProviderEntry(provider);
            token = provider.provide;

        } else {
            throw new Error("unknown token or missing provider");
        }
        this.bindings.set(token, providerEntry);
    }

    get<T>(token: InjectionToken<T>) {
        let instance: unknown;
        const entry = this.bindings.get(token);
        if (entry) {
            instance = entry.instance;
        } else {
            if (this.parent) {
                instance = this.parent.get<T>(token);
            } else {
                throw new Error("unknown token");
            }
        }
        return instance as T;
    }

    private createProviderEntry<T>(provider: Provider<T> | Constructor<T>): ProviderEntry<T> {
        let providerEntry: ProviderEntry<T>;
        if (isConstructor(provider)) {
            providerEntry = new ClassProviderEntry({ provide: provider, useClass: provider }, this);
        } else if (isClassProvider<T>(provider)) {
            providerEntry = new ClassProviderEntry(provider, this);
        } else if (isValueProvider<T>(provider)) {
            providerEntry = new ValueProviderEntry(provider);
        } else if (isFactoryProvider<T>(provider)) {
            providerEntry = new FactoryProviderEntry(provider, this);
        } else {
            throw new Error("unknown provider");
        }
        return providerEntry;
    }

}