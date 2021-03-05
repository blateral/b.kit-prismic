import {
    PrismicLink,
    PrismicPage,
    linkResolver,
    resolveUnknownLink,
} from './prismic';

import Prismic from 'prismic-javascript';
import PrismicClient from '@prismicio/client';
import ResolvedApi from 'prismic-javascript/types/ResolvedApi';
import { ServerResponse } from 'http';

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

export function getAllPagesOfCustomType({
    api,
    prismicCustomType = ['page'],
    pageIndex = 1,
    documents,
}: {
    api: ResolvedApi;
    prismicCustomType: string[];
    pageIndex: number;
    documents?: any[];
}): Promise<any[]> {
    if (!documents) documents = [];

    return api
        .query(
            PrismicClient.Predicates.any('document.type', prismicCustomType),
            {
                page: pageIndex,
                pageSize: 100,
                fetch: [],
            }
        )
        .then(
            ({
                next_page,
                results,
            }: {
                next_page: any | null;
                results: any[];
            }) => {
                if (next_page !== null) {
                    return getAllPagesOfCustomType({
                        api,
                        prismicCustomType,
                        pageIndex: pageIndex + 1,
                        documents: documents ? documents.concat(results) : [],
                    });
                }
                return documents ? documents.concat(results) : [];
            }
        );
}

export const generateSitemap = async ({
    req,
    res,
    prismicCustomType,
}: {
    req: any;
    res?: ServerResponse;
    prismicCustomType: string[];
}) => {
    const getApi = await initPrismicApi(req);

    const pages = await getAllPagesOfCustomType({
        api: getApi,
        prismicCustomType,
        pageIndex: 1,
    });

    const siteMapUrls = pages.map((doc: PrismicPage) => {
        return `https://${req && req.headers.host}${linkResolver(doc)}`;
    });

    if (res) {
        const xml = mapUrlsToXml(siteMapUrls);
        res.setHeader('Content-Type', 'application/xml');
        res.write(xml);
        res.end();
    }
};

function mapUrlsToXml(urls: string[]) {
    const xmlUrls = urls
        .map((url) => {
            return `<url><loc>${encodeURI(url)}</loc></url>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlUrls}</urlset>`;
}
