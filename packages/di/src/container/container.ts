import {
    getOrCreate,
    setIfNotPresent,
    Constructor,
    isConstructor
} from "@proto/utils";
import {
    InjectionToken,
    Provider,
    isClassProvider,
    isValueProvider,
    isFactoryProvider,
    isExistingProvider,
    isScopedValueProvider,
    ScopeContext,
    formatToken,
} from "../types";
import {
    ClassProviderEntry,
    ExistingProviderEntry,
    FactoryProviderEntry,
    MultiProviderEntry,
    ProviderEntry,
    ScopedValueProviderEntry,
    ValueProviderEntry
} from "./provider-entry";

export class Container {

    private readonly bindings = new Map<InjectionToken, ProviderEntry>();

    constructor(
        private readonly parent?: Container,
    ) { }

    register<T>(constructorOrProvider: Constructor<T> | Provider<T>): this {
        const provider: Provider<T> = (isConstructor<T>(constructorOrProvider)) ?
            {
                provide: constructorOrProvider,
                useClass: constructorOrProvider
            }
            : constructorOrProvider;

        const isMulti = isScopedValueProvider(provider)
            ? false
            : (provider.multi ?? false);

        if (isMulti) {
            let currentEntry = getOrCreate(
                this.bindings,
                provider.provide,
                () => new MultiProviderEntry<T>());

            if (currentEntry instanceof MultiProviderEntry) {
                currentEntry.addEntry(this.createSingleProviderEntry(provider));
            } else {
                throw new Error("Cannot add multi provider to non multi binding");
            }

        } else {
            setIfNotPresent(
                this.bindings,
                provider.provide,
                () => this.createSingleProviderEntry(provider),
                () => new Error("Multiply defined binding")
            );
        }
        return this;
    }

    get<T>(token: InjectionToken<T>, context: ScopeContext | null = null) {
        let instance: unknown;
        const entry = this.bindings.get(token);
        if (entry) {
            instance = entry.getInstance(context);
        } else {
            if (this.parent) {
                instance = this.parent.get<T>(token, context);
            } else {
                throw new Error(`unknown token ${formatToken(token)}`);
            }
        }
        return instance as T;
    }

    configureScopeContext(context: ScopeContext, values: [InjectionToken, unknown][]): void {
        values.forEach(
            ([token, value]) => {
                const entry = this.bindings.get(token);
                if (entry instanceof ScopedValueProviderEntry) {
                    entry.setInstance(context, value);
                } else {
                    throw new Error("binding not scoped");
                }
            }
        );
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
        } else if (isScopedValueProvider<T>(provider)) {
            providerEntry = new ScopedValueProviderEntry(provider);
        } else {
            throw new Error("unknown provider");
        }
        return providerEntry;
    }

}