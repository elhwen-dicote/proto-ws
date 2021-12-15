import { getOrCreate, setIfNotPresent } from "@proto/utils";
import { ScopeContext } from "../types";

export interface InstanceFactory<T> {
    getInstance(context: ScopeContext | null): T;
}

export class SingletonInstanceFactory<T = unknown> implements InstanceFactory<T>{

    private instance: T | undefined;

    constructor(
        private readonly factory: (context: ScopeContext | null) => T,
    ) { }

    getInstance(context: ScopeContext | null): T {
        return (this.instance ??= this.factory(context));
    }

}

export class TransientInstanceFactory<T = unknown> implements InstanceFactory<T>{

    constructor(
        private readonly factory: (context: ScopeContext | null) => T,
    ) { }

    getInstance(context: ScopeContext | null): T {
        return this.factory(context);
    }

}

export class ScopedInstanceFactory<T = unknown> implements InstanceFactory<T> {

    private instances = new WeakMap<ScopeContext, T>();

    constructor(
        private readonly factory: (context: ScopeContext | null) => T,
    ) { }

    getInstance(context: ScopeContext | null): T {
        if (context == null) {
            throw new Error("Unavailable scope context");
        }

        return getOrCreate(
            this.instances,
            context,
            () => this.factory(context)
        );
    }

    setInstance(context: ScopeContext | null, value: T) {
        if (context == null) {
            throw new Error("Invalid scope context.");
        }
        setIfNotPresent(
            this.instances,
            context,
            () => value,
            () => new Error("Value already set for this scope context.")
        );
        this.instances.set(context, value);
    }

}