import {
    PrismicLink,
    linkResolver,
    resolveUnknownLink,
    isPrismicLinkEmpty,
} from './prismic';

import Prismic from 'prismic-javascript';

export const initPrismicApi = async (req: any) => {
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    const TOKEN = process.env.NEXT_PUBLIC_TOKEN || '';

    if (!API_ENDPOINT) throw Error('MISSING ENV: API_ENDPOINT not defined');
    if (!TOKEN) throw Error('MISSING ENV: TOKEN not defined');

    return await Prismic.getApi(API_ENDPOINT, {
        accessToken: TOKEN,
        req,
    });
};

export const getPreviewUrl = async (req: any, token: string, docId: string) => {
    const api = await initPrismicApi(req);
    return await api
        .getPreviewResolver(token, docId)
        .resolve(linkResolver, '/');
};

export const getPageUrl = (req: any, domain?: PrismicLink) => {
    let href = '';
    try {
        let url: URL;
        if (!isPrismicLinkEmpty(domain)) {
            url = new URL(resolveUnknownLink(domain) || '');
            url.pathname = req?.url;
            if (url) href = url.href;
        } else href = req?.url;
    } catch (err) {
        console.warn(err);
    }

    return href;
};
