import { createContext } from 'react';
import { Document } from 'prismic-javascript/types/documents';

export interface PrismicCtx {
    /** Replace default linkResolver */
    linkResolver?: (doc: Document) => string;
}

export const PrismicContext = createContext<PrismicCtx>({});
