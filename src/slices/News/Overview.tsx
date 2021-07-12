import {
    PrismicBoolean,
    PrismicHeading,
    PrismicSlice,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getText,
    PrismicNewsPage,
    getHtmlText,
    PrismicRichText,
    getImageFromUrls,
    getHeadlineTag,
} from 'utils/prismic';

import { NewsOverview } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { ImageSizeSettings } from 'utils/mapping';

export interface NewsOverviewSliceType
    extends PrismicSlice<'NewsOverview', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        secondaryAction?: (props: {
            isInverted?: boolean;
            label?: string;
            href?: string;
            isExternal?: boolean;
        }) => React.ReactNode;
    };
    queryParams?: Record<string, any>;
    secondaryAction?: (props: {
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
    primary: { title, super_title, text },
    secondaryAction,
    queryParams,
    items,
}) => {


    return (
        <NewsOverview
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            text={getHtmlText(text)}
            tags={generateUniqueTags(items)}
            queryParams={queryParams}
            news={mapNewsListData(items, secondaryAction) || []}
        />
    );
};

function generateUniqueTags(newsCollection?: PrismicNewsPage[]) {
    if (!newsCollection || newsCollection.length === 0) return [];

    const newsTagsCollection = newsCollection?.map((news) => news.tags) || [];
    const flatNewsTags = flatten(newsTagsCollection);
    const uniqueNewsTags = Array.from(new Set(flatNewsTags));
    return uniqueNewsTags;
}

function mapNewsListData(
    newsCollection: PrismicNewsPage[] | undefined,
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode
) {
    return newsCollection?.sort(byDateDescending)?.map((news) => {
        const introImageUrl =
            (news?.data?.news_image?.url &&
                getImg(news?.data?.news_image)?.url) ||
            '';

        let publicationDate = undefined;
        try {
            publicationDate = news.data.publication_date
                ? generatePublicationDateObject(news.data.publication_date)
                : new Date(news.first_publication_date || '');
        } catch {
            publicationDate = undefined;
        }

        const mappedImage: ImageProps = {
            ...getImageFromUrls(
                {
                    small: introImageUrl || '',
                },
                imageSizes.main,
                getText(news.data.news_image?.alt)
            ),
        };
        return {
            image: mappedImage,
            tag: (news.tags && news.tags[0] && news.tags[0]) || 'News',
            publishDate: publicationDate,
            title:
                (news?.data?.news_heading && getText(news.data.news_heading)) ||
                '',
            text:
                news.data &&
                news.data.news_intro &&
                getHtmlText(news.data.news_intro),
            secondaryAction: (isInverted: boolean) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label:
                        getText(news.data.secondary_label) || 'Mehr erfahren',
                    href: `/news/${news.uid}`,
                    isExternal: isPrismicLinkExternal(news.data.secondary_link),
                }),
        };
    });
}

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
