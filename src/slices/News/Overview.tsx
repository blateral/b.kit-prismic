import {
    PrismicBoolean,
    PrismicSlice,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getText,
    PrismicNewsPage,
    getHtmlText,
    getImageFromUrls,
    PrismicImage,
    PrismicSelectField,
    mapPrismicSelect,
    PrismicKeyText,
} from 'utils/prismic';

import { NewsOverview } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';

type BgMode = 'full' | 'inverted';

export interface NewsOverviewSliceType
    extends PrismicSlice<'NewsOverview', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        show_more_text?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    queryParams?: Record<string, any>;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

const imageSizes = {
    main: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 516 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const NewsOverviewSlice: React.FC<NewsOverviewSliceType> = ({
    primary: { bg_mode, show_more_text },
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    cardAction,
    queryParams,
    items,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <NewsOverview
            tags={generateUniqueTag(items)}
            queryParams={queryParams}
            news={mapNewsListData(items, cardAction) || []}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            showMoreText={getText(show_more_text)}
        />
    );
};

function generateUniqueTag(newsCollection?: PrismicNewsPage[]) {
    if (!newsCollection || newsCollection.length === 0) return [];

    const newsTagsCollection = newsCollection?.map((news) => news.tags) || [];
    const flatNewsTags = flatten(newsTagsCollection);
    const uniqueNewsTags = Array.from(new Set(flatNewsTags));

    return uniqueNewsTags;
}

function mapNewsListData(
    newsCollection: PrismicNewsPage[] | undefined,
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode
) {
    return newsCollection?.sort(byDateDescending)?.map((news) => {
        const introImageUrl = createImageUrl(news.data.news_image);
        const publicationDate = generatePublicationDate(
            news.data.publication_date || '',
            news.first_publication_date || ''
        );

        const mappedImage: ImageProps = createMappedImage(
            introImageUrl,
            news?.data?.news_image?.alt || ''
        );

        const newsData = {
            image: mappedImage,
            tag: news?.tags?.[0],
            publishDate: publicationDate,
            title:
                (news?.data?.news_heading && getText(news.data.news_heading)) ||
                '',
            text:
                news.data &&
                news.data.news_intro &&
                getHtmlText(news.data.news_intro),
            link: { href: `/news/${news.uid}`, isExternal: false },

            secondaryAction: cardAction
                ? (isInverted: boolean) =>
                      cardAction({
                          isInverted,
                          label: 'Beitrag lesen',
                          href: `/news/${news.uid}`,
                          isExternal: isPrismicLinkExternal(
                              news.data.secondary_link
                          ),
                      })
                : undefined,
        };

        return newsData;
    });
}

const generatePublicationDate = (
    publication_date?: string,
    first_publication_date?: string
) => {
    if (!publication_date && !first_publication_date) return undefined;
    try {
        return publication_date
            ? generatePublicationDateObject(publication_date)
            : first_publication_date
            ? new Date(first_publication_date)
            : undefined;
    } catch {
        console.error('Error whlie generating publication date for news');
        return undefined;
    }
};

const createImageUrl = (image?: PrismicImage) => {
    return (image && getImg(image)?.url) || '';
};

const createMappedImage = (imageUrl?: string, imageAlt?: string) => {
    return {
        ...getImageFromUrls(
            {
                small: imageUrl || '',
            },
            imageSizes.main,
            getText(imageAlt)
        ),
    };
};

const byDateDescending = (a: PrismicNewsPage, b: PrismicNewsPage) => {
    let aDate: Date | undefined = new Date();
    let bDate: Date | undefined = new Date();
    if (a.data.publication_date && b.data.publication_date) {
        aDate = generatePublicationDateObject(a.data.publication_date);
        bDate = generatePublicationDateObject(b.data.publication_date);
    } else if (!a.data.publication_date && b.data.publication_date) {
        aDate = new Date(
            a.first_publication_date || a.last_publication_date || ''
        );
        bDate = generatePublicationDateObject(b.data.publication_date);
    } else if (a.data.publication_date && !b.data.publication_date) {
        aDate = generatePublicationDateObject(a.data.publication_date);
        bDate = new Date(
            b.first_publication_date || b.last_publication_date || ''
        );
    } else if (!a.data.publication_date && !b.data.publication_date) {
        aDate = new Date(
            a.first_publication_date || a.last_publication_date || ''
        );
        bDate = new Date(
            b.first_publication_date || b.last_publication_date || ''
        );
    } else {
        return -1;
    }

    return (bDate as any) - (aDate as any);
};

function flatten(arr: any[]): any[] {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(
            Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
        );
    }, []);
}

function generatePublicationDateObject(publication_date?: string) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split('/').filter(Boolean);
    try {
        const dateParts = parts[0].split('-').filter(Boolean);

        const publicationDate = new Date(
            +dateParts[0],
            +dateParts[1] - 1,
            +dateParts[2]
        );

        return publicationDate;
    } catch (e) {
        console.error('Error in NewsIntro date generation. \n', e);
        return undefined;
    }
}
