import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicSlice,
    isPrismicLinkExternal,

    resolveUnknownLink,
    getText,
    PrismicNewsPage,
    getHtmlText,
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsList } from '@blateral/b.kit';
import React from 'react';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsListSliceType extends PrismicSlice<'NewsList', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        title?: PrismicHeading;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const NewsListSlice: React.FC<NewsListSliceType> = ({
    primary: {
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        title
    },
    items,
    primaryAction,
    secondaryAction,
}) => {

    const newsListMap = mapNewsListData(items);
    return (
        <NewsList
            title={getText(title)}
            news={newsListMap}
            isInverted={is_inverted}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: getText(secondary_label),
                    href: resolveUnknownLink(secondary_link) || '',
                    isExternal: isPrismicLinkExternal(secondary_link),
                })
            }
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

