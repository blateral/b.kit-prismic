import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    getHtmlText,
    PrismicNewsPage,
    getText,
    isPrismicLinkExternal,
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsFooter } from '@blateral/b.kit';
import React from 'react';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsFooterSliceType extends PrismicSlice<'NewsFooter', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;

        publication_date?: PrismicKeyText;
        is_inverted?: PrismicBoolean;
        news_footer_background?: PrismicBoolean



    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

}

export const NewsFooterSlice: React.FC<NewsFooterSliceType> = ({
    primary: {
        news_footer_background,
        is_inverted
    },
    items,
    secondaryAction


}) => {

    const newsListMap = mapNewsListData(items, secondaryAction);

    return (
        <NewsFooter
            news={newsListMap || []}
            isInverted={is_inverted}
            hasBack={news_footer_background}

        />
    );
};
function mapNewsListData(newsCollection: PrismicNewsPage[] | undefined,
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode) {

    return newsCollection?.map(news => {
        return {
            tag: news.tags[0] || "News",
            publishDate: new Date(news.last_publication_date || ""),
            title: getText(news.data.news_heading),
            text: getHtmlText(news.data.news_intro),
            secondaryAction: (isInverted: boolean) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: getText(news.data.secondary_label) || "Mehr erfahren",
                    href: `/news/${news.uid}`,
                    isExternal: isPrismicLinkExternal(news.data.secondary_link),
                })


        }
    })
}

