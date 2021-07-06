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
} from '../../utils/prismic';

import { NewsList, NewsOverview } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { ImageSizeSettings } from '../../utils/mapping';

export interface NewsOverviewSliceType extends PrismicSlice<'NewsOverview', PrismicNewsPage> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        tags?: string[];
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

export const NewsOverviewSlice: React.FC<NewsOverviewSliceType> = ({
    primary: {

        title,
        super_title,
        text
    },
    items,

}) => {



    const newsListMap = mapNewsListData(items);
    return (
        <NewsOverview
            superTitle={getText(super_title)}
            superTitleAs={super_title && super_title[0] && getHtmlElementFromPrismicType(super_title[0] as any) || "div"}
            title={getText(title)}
            titleAs={title && title[0] && getHtmlElementFromPrismicType(title[0] as any) || "div"}

            text={getHtmlText(text)}
            tags={["Test", "Test 1", "Test 2"]}
            news={newsListMap || []}



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
