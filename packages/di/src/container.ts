import { getConstructorArgs } from "./decorators-utils";
import {
    InjectionToken,
    Constructor,
    isConstructor,
    Provider,
    ClassProvider,
    isClassProvider,
    ValueProvider,
    isValueProvider,
    FactoryProvider,
    isFactoryProvider,
    ExistingProvider,
    isExistingProvider} from "./types";

interface ProviderEntry<T = unknown> {
    readonly instance: T;
}

class ClassProviderEntry<T = unknown> implements ProviderEntry<T> {

    private _dependencies: InjectionToken<unknown>[];
    private _factory: () => T;
    private _instance?: T;

    constructor(
        { useClass }: ClassProvider<T>,
        container: Container) {
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

    private _factory: () => T;
    private _instance?: T;

    constructor(
        { useFactory, inject }: FactoryProvider<T>,
        container: Container,
    ) {
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

    public readonly instance: T;

    constructor(
        { useValue }: ValueProvider<T>
    ) {
        this.instance = useValue;
    }
}

class ExistingProviderEntry<T = unknown> implements ProviderEntry<T> {

    private _factory: () => T;
    private _instance?: T;

    constructor(
        { useExisting }: ExistingProvider<T>,
        container: Container,
    ) {
        this._factory = () => container.get<T>(useExisting);
    }

    get instance() {
        return (this._instance ??= this._factory());
    }

}

class MultiProviderEntry<T = unknown> implements ProviderEntry<T[]> {

    private entries: ProviderEntry<T>[] = [];
    private _factory: () => T[];

    constructor(
    ) {
        this._factory = () => this.entries.map(
            (entry) => entry.instance
        );
    }

    addEntry(entry: ProviderEntry<T>) {
        if (!this.entries.includes(entry)) {
            this.entries.push(entry);
        }
    }

    get instance() {
        return this._factory();
    }


}


export class Container {

    private readonly bindings = new Map<InjectionToken, ProviderEntry>();

    constructor(
        private readonly parent?: Container,
    ) { }

    register<T>(provider: Constructor<T> | Provider<T>) {
        if (isConstructor<T>(provider)) {
            provider = { provide: provider, useClass: provider };
        }

        const isMulti = provider.multi ?? false;

        if (isMulti) {
            let currentEntry = this.bindings.get(provider.provide);
            if (!currentEntry) {
                currentEntry = new MultiProviderEntry();
                this.bindings.set(provider.provide, currentEntry);
            } else if (!(currentEntry instanceof MultiProviderEntry)) {
                throw new Error("Cannot add multi provider to non multi binding");
            }
            (currentEntry as MultiProviderEntry<T>).addEntry(this.createSingleProviderEntry(provider));

        } else {
            if (this.bindings.has(provider.provide)) {
                throw new Error("Multiply defined binding");
            } else {
                this.bindings.set(provider.provide, this.createSingleProviderEntry(provider));
            }
        }
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
                throw new Error(`unknown token ${String(token)}`);
            }
        }
        return instance as T;
    }

    private createSingleProviderEntry<T>(provider: Provider<T>): ProviderEntry<T> {
        let providerEntry: ProviderEntry<T>;
        if (isClassProvider<T>(provider)) {
            providerEntry = new ClassProviderEntry(provider, this);
        } else if (isValueProvider<T>(provider)) {
            providerEntry = new ValueProviderEntry(provider);
        } else if (isFactoryProvider<T>(provider)) {
            providerEntry = new FactoryProviderEntry(provider, this);
        } else if (isExistingProvider<T>(provider)) {
            providerEntry = new ExistingProviderEntry(provider, this);
        } else {
            throw new Error("unknown provider");
        }
        return providerEntry;
    }

}