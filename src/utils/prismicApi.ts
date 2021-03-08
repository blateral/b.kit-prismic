import { PrismicLink, linkResolver, resolveUnknownLink } from './prismic';

import Prismic from 'prismic-javascript';

export const initPrismicApi = async (req: any) => {
    const API_ENDPOINT = process.env.API_ENDPOINT || '';
    const TOKEN = process.env.TOKEN || '';

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
    return `${resolveUnknownLink(domain) || ''}${req?.url || ''}`;
};
