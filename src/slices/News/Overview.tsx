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
    PrismicImage,
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
            tags={generateUniqueTag(items)}
            queryParams={queryParams}
            news={mapNewsListData(items, secondaryAction) || []}
        />
    );
};

function generateUniqueTag(newsCollection?: PrismicNewsPage[]) {
    if (!newsCollection || newsCollection.length === 0) return [];

    const newsTagsCollection = newsCollection?.map((news) => news.tags) || [];
    const flatNewsTags = flatten(newsTagsCollection);
    flatNewsTags.push('News');
    const uniqueNewsTags = Array.from(new Set(flatNewsTags));

    uniqueNewsTags.sort();

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
        const introImageUrl = createImageUrl(news.data.news_image)
        const publicationDate = generatePublicationDate(news.data.publication_date || "", news.first_publication_date || "")


        const mappedImage: ImageProps = createMappedImage(introImageUrl, news?.data?.news_image?.alt || "")


        const newsData = {
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
            link: { href: `/news/${news.uid}`, isExternal: false },

            secondaryAction: (isInverted: boolean) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: 'Beitrag lesen',
                    href: `/news/${news.uid}`,
                    isExternal: isPrismicLinkExternal(news.data.secondary_link),
                }),
        };

        return newsData;
    });
}


const generatePublicationDate = (publication_date?: string, first_publication_date?: string) => {
    if (!publication_date && !first_publication_date) return undefined
    try {
        return publication_date
            ? generatePublicationDateObject(publication_date)
            : first_publication_date ? new Date(first_publication_date) : undefined;
    } catch {
        console.error("Error whlie generating publication date for news")
        return undefined;
    }
}

const createImageUrl = (image?: PrismicImage) => {

    return (image &&
        getImg(image)?.url) ||
        '';
}

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
