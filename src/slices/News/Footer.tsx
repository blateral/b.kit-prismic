import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    getHtmlText,
    PrismicNewsPage,
    getText,
    isPrismicLinkExternal,
    getImageFromUrls,
    getPrismicImage as getImg,
} from 'utils/prismic';

import { ImageSizeSettings } from 'utils/mapping';
import { NewsFooter } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

export interface NewsFooterSliceType
    extends PrismicSlice<'NewsFooter', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;

        publication_date?: PrismicKeyText;
        is_inverted?: PrismicBoolean;
        news_footer_background?: PrismicBoolean;
    };
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    onTagClick?: (name?: string) => void;
}

const imageSizes = {
    main: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 516 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const NewsFooterSlice: React.FC<NewsFooterSliceType> = ({
    primary: { news_footer_background, is_inverted },
    items,
    secondaryAction,
    onTagClick,
}) => {
    const newsListMap = mapNewsListData({
        newsCollection: items,
        secondaryAction,
        onTagClick,
    });

    return (
        <NewsFooter
            news={newsListMap || []}
            isInverted={is_inverted}
            hasBack={news_footer_background}
            showMoreText={'mehr anzeigen'}
        />
    );
};
function mapNewsListData({
    newsCollection,
    secondaryAction,
    onTagClick,
}: {
    newsCollection: PrismicNewsPage[] | undefined;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name?: string) => void;
}) {
    if (!newsCollection) return [];

    return newsCollection.sort(byDateDescending).map((news) => {
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
            link: { href: `/news/${news.uid}`, isExternal: false },

            secondaryAction: secondaryAction
                ? (isInverted: boolean) =>
                      secondaryAction({
                          isInverted,
                          label: 'Beitrag lesen',
                          href: `/news/${news.uid}`,
                          isExternal: isPrismicLinkExternal(
                              news.data.secondary_link
                          ),
                      })
                : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

function generatePublicationDateObject(publication_date?: PrismicKeyText) {
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
        console.error('Error in NewsFooter date generation. \n', e);
        return undefined;
    }
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
