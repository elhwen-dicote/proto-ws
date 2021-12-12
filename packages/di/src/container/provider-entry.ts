import { getConstructorArgs } from "../decorators";
import {
    ClassProvider,
    FactoryProvider,
    ValueProvider,
    ExistingProvider,
    ScopedValueProvider,
    Scope,
    ScopeContext,
    isStatic,
} from "../types";
import {
    InstanceFactory,
    ScopedInstanceFactory,
    SingletonInstanceFactory,
    TransientInstanceFactory
} from "./instance-factory";
import { Container } from "./container";

export interface ProviderEntry<T = unknown> {
    getInstance(context: ScopeContext | null): T;
}

export class ClassProviderEntry<T = unknown> implements ProviderEntry<T> {

    private readonly scope: Scope;
    private readonly instanceFactory: InstanceFactory<T>;

    constructor(
        { useClass, scope }: ClassProvider<T>,
        container: Container) {

        this.scope = scope ?? Scope.Singleton;
        const dependencies = getConstructorArgs(useClass);

        const factory = (context: ScopeContext | null) => {
            context = context?.getEnclosingContext(this.scope) ?? null;
            return new useClass(...dependencies.map(
                (token) => container.get(token, context)));
        };
        this.instanceFactory = buildInstanceFactory(this.scope, factory);
    }

    getInstance(context: ScopeContext | null) {
        context = context?.getEnclosingContext(this.scope) ?? null;
        return this.instanceFactory.getInstance(context);
    }

}

export class FactoryProviderEntry<T = unknown> implements ProviderEntry<T> {

    private readonly scope: Scope;
    private readonly instanceFactory: InstanceFactory<T>;

    constructor(
        { useFactory, inject, scope }: FactoryProvider<T>,
        container: Container,
    ) {
        this.scope = scope ?? Scope.Singleton;

        const factory = (context: ScopeContext | null) => {
            return useFactory(...(inject ?? []).map(
                (token) => container.get(
                    token,
                    context?.getEnclosingContext(this.scope) ?? null)));
        };
        this.instanceFactory = buildInstanceFactory(this.scope, factory);
    }

    getInstance(context: ScopeContext | null) {
        return this.instanceFactory.getInstance(
            context?.getEnclosingContext(this.scope) ?? null);
    }
}

export class ValueProviderEntry<T = unknown> implements ProviderEntry<T> {

    private readonly instance: T;

    constructor(
        { useValue }: ValueProvider<T>
    ) {
        this.instance = useValue;
    }

    getInstance(_context: ScopeContext | null = null) {
        return this.instance;
    }
}

export class ExistingProviderEntry<T = unknown> implements ProviderEntry<T> {

    private readonly factory: (context: ScopeContext | null) => T;

    constructor(
        { useExisting }: ExistingProvider<T>,
        container: Container,) {
        this.factory = (context: ScopeContext | null) => container.get<T>(useExisting, context);
    }

    getInstance(context: ScopeContext | null) {
        return this.factory(context);
    }
}

export class ScopedValueProviderEntry<T = unknown> implements ProviderEntry<T> {

    private readonly scope: Scope;
    private readonly instanceFactory: ScopedInstanceFactory<T>;

    constructor({ scope }: ScopedValueProvider<T>) {
        if (!scope || isStatic(scope)) {
            throw new Error("scope for scoped value provider must not be null or static.");
        }
        this.scope = scope;
        const factory = (_context: ScopeContext | null): T => {
            throw new Error(`No value for scope ${scope.toString()}.`);
        };
        this.instanceFactory = new ScopedInstanceFactory(factory);
    }

    getInstance(context: ScopeContext | null) {
        return this.instanceFactory.getInstance(
            context?.getEnclosingContext(this.scope) ?? null);
    }

    setInstance(context: ScopeContext | null, value: T) {
        this.instanceFactory.setInstance(
            context?.getEnclosingContext(this.scope) ?? null,
            value);
    }
}

export class MultiProviderEntry<T = unknown> implements ProviderEntry<T[]> {

    private readonly entries: ProviderEntry<T>[] = [];
    private readonly factory: (context: ScopeContext | null) => T[];

    constructor() {
        this.factory = (context: ScopeContext | null) => this.entries.map(
            (entry) => entry.getInstance(context)
        );
    }

    addEntry(entry: ProviderEntry<T>) {
        if (!this.entries.includes(entry)) {
            this.entries.push(entry);
        }
    }

    getInstance(context: ScopeContext | null = null) {
        return this.factory(context);
    }


}

function buildInstanceFactory<T>(
    scope: Scope,
    factory: (context: ScopeContext | null) => T)
    : InstanceFactory<T> {
    let instanceFactory: InstanceFactory<T>;
    switch (scope) {
        case Scope.Singleton:
            instanceFactory = new SingletonInstanceFactory(factory);
            break;

        case Scope.Transient:
            instanceFactory = new TransientInstanceFactory(factory);
            break;

        default:
            instanceFactory = new ScopedInstanceFactory(factory);
            break;
    }
    return instanceFactory;
}

