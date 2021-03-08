import { PrismicPage, linkResolver } from './prismic';

import PrismicClient from '@prismicio/client';
import ResolvedApi from 'prismic-javascript/types/ResolvedApi';
import { ServerResponse } from 'http';
import { initPrismicApi } from './prismicApi';

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
