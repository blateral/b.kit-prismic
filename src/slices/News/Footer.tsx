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

} from '../../utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from '../../utils/mapping';
import { NewsFooter } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

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

const imageSizes = {
    main: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 516 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 }
    },
} as ImageSizeSettings<{ main: ImageProps }>;

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
        const introImageUrl = news?.data?.news_image?.url && getImg(news?.data?.news_image)?.url || "";

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

