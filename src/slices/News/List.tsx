import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicSlice,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    resolveUnknownLink,
    getText,
    PrismicNewsPage,
    getHtmlText,
    PrismicRichText,
    getImageFromUrls,
    getHeadlineTag,
    isValidAction,
    PrismicSelectField,
    mapPrismicSelect,
} from 'utils/prismic';

import { NewsList } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';

type BgMode = 'full' | 'inverted';

export interface NewsListSliceType
    extends PrismicSlice<'NewsList', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        show_more_text?: PrismicKeyText;
        bg_mode?: PrismicSelectField;
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
    onTagClick?: (name: string) => void;
}

const imageSizes = {
    main: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 516 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const NewsListSlice: React.FC<NewsListSliceType> = ({
    primary: {
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        title,
        super_title,
        bg_mode,
        text,
    },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
    onTagClick,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    const newsListMap = mapNewsListData({
        newsCollection: items,
        secondaryAction,
        onTagClick,
    });

    return (
        <NewsList
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            text={getHtmlText(text)}
            showMoreText={'mehr anzeigen'}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            news={newsListMap}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
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
            secondaryAction: (isInverted: boolean) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: 'Beitrag lesen',
                    href: `/news/${news.uid}`,
                    isExternal: isPrismicLinkExternal(news.data.secondary_link),
                }),
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
        console.error('Error in NewsIntro date generation. \n', e);
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
