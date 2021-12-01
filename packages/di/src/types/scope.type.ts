export namespace Scope {
    export const Default = Symbol("Scope:Default");
    export const Singleton = Default;
    export const Transient = Symbol("Scope:Transient");
    export const Request = Symbol("Scope:Request");
}
export type StaticScope = typeof Scope.Default | typeof Scope.Transient;
export type Scope = symbol;

export function isStatic(scope: Scope): scope is StaticScope {
    return scope === Scope.Default || scope === Scope.Transient;
}

export abstract class ScopeContext {

    protected constructor(
        public readonly scope: Scope,
        private readonly enclosingContext: ScopeContext | null = null,
    ) {
        if (isStatic(scope)) {
            throw new Error("Scope context must reference not static scope.");
        }
    }

    /**
     * Search enclosing chain (including this) for a context whose scope is scope.
     * Only non static scopes are searched for. If scope is static,
     * returns null.
     * 
     * @param scope the scope to search for.
     * @returns the context or null if not found.
     */
    getEnclosingContext(scope: Scope): ScopeContext | null {
        if (isStatic(scope)) {
            return null;
        } else {
            return (scope === this.scope)
                ? this
                : (this.enclosingContext != null)
                    ? this.enclosingContext.getEnclosingContext(scope)
                    : null;
        }
    }

}

export class RequestScopeContext extends ScopeContext {

    constructor() {
        super(Scope.Request);
    }

    public static create() {
        return new RequestScopeContext();
    }

}

