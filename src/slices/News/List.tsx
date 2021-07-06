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
    getHtmlElementFromPrismicType,
    getImageFromUrls,
} from 'utils/prismic';

import { NewsList } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { ImageSizeSettings } from 'utils/mapping';

export interface NewsListSliceType extends PrismicSlice<'NewsList', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        has_back?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        show_more_text?: PrismicKeyText;
    };
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

const imageSizes = {
    main: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 516 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 }
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const NewsListSlice: React.FC<NewsListSliceType> = ({
    primary: {
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        title,
        super_title,
        has_back,
        show_more_text,
        text
    },
    items,
    primaryAction,
    secondaryAction,
}) => {



    const newsListMap = mapNewsListData(items);
    return (
        <NewsList
            superTitle={getText(super_title)}
            superTitleAs={super_title && super_title[0] && getHtmlElementFromPrismicType(super_title[0] as any) || "div"}
            title={getText(title)}
            titleAs={title && title[0] && getHtmlElementFromPrismicType(title[0] as any) || "div"}

            text={getHtmlText(text)}
            showMoreText={show_more_text || ""}
            hasBack={has_back}
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
        const introImageUrl = news?.data?.news_image?.url && getImg(news?.data?.news_image)?.url || "";

        let publicationDate = undefined;
        try {
            publicationDate = news.data.publication_date ? generatePublicationDateObject(news.data.publication_date) : new Date(news.first_publication_date || "")
        }
        catch {
            publicationDate = undefined;
        }

        const mappedImage: ImageProps = {
            ...getImageFromUrls(
                {
                    small: introImageUrl || ''
                },
                imageSizes.main,
                getText(news.data.news_image?.alt)
            ),
        };
        return {
            image: mappedImage,
            tag: news.tags && news.tags[0] && news.tags[0] || "News",
            publishDate: publicationDate,
            title: news?.data?.news_heading && getText(news.data.news_heading) || "",
            text: news.data && news.data.news_intro && getHtmlText(news.data.news_intro),
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



function generatePublicationDateObject(publication_date?: PrismicKeyText) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split("/").filter(Boolean);
    try {
        const dateParts = parts[0].split("-").filter(Boolean);

        const publicationDate = new Date(+dateParts[0], (+dateParts[1] - 1), +dateParts[2])

        return publicationDate;
    }
    catch (e) {
        console.error("Error in NewsIntro date generation. \n", e)
        return undefined;
    }

}
