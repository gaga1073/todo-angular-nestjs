declare const opaqueSymbol: unique symbol;

export type Opaque<T, U> = T & { readonly [opaqueSymbol]: U };
