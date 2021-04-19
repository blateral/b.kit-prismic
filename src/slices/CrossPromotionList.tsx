import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from '../utils/mapping';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    getHeadlineTag,
    getHtmlText,
    getImageFromUrls,
    getPrismicImage as getImg,
    getText,
    isPrismicLinkExternal,
    mapPrismicSelect,
    resolveUnknownLink,
} from '../utils/prismic';

import { CrossPromotion } from '@blateral/b.kit';
import { PromotionCardProps } from '@blateral/b.kit/lib/components/blocks/PromotionCard';
import React from 'react';

type BgMode = 'full' | 'splitted';
interface ImageFormats {
    square: string;
    landscape: string;
    'landscape-wide': 'landscape-wide';
    portrait: string;
}

interface CrossPromotionItems {
    is_main?: PrismicBoolean;
    image?: PrismicImage;
    title?: PrismicHeading;
    link?: PrismicLink;
}

export interface CrossPromotionListSliceType
    extends PrismicSlice<'CrossPromotionList', CrossPromotionItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;

        format?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
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

// for this component defines image sizes
const imageSizes = {
    square: {
        small: { width: 619, height: 464 },
        medium: { width: 791, height: 593 },
        semilarge: { width: 481, height: 481 },
        large: { width: 686, height: 686 },
        xlarge: { width: 690, height: 690 },
    },
    landscape: {
        small: { width: 619, height: 464 },
        medium: { width: 983, height: 737 },
        large: { width: 1399, height: 1050 },
        xlarge: { width: 1400, height: 1050 },
    },
    'landscape-wide': {
        small: { width: 619, height: 464 },
        medium: { width: 983, height: 737 },
        large: { width: 1399, height: 824 },
        xlarge: { width: 1400, height: 826 },
    },
    portrait: {
        small: { width: 619, height: 464 },
        medium: { width: 791, height: 593 },
        semilarge: { width: 689, height: 1054 },
        large: { width: 790, height: 1054 },
        xlarge: { width: 790, height: 1055 },
    },
} as ImageSizeSettings<ImageFormats>;

export const CrossPromotionListSlice: React.FC<CrossPromotionListSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,
        bg_mode,
        format,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    imageFormatAlias = {
        square: 'square',
        landscape: 'landscape',
        'landscape-wide': 'landscape-wide',
        portrait: 'portrait',
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    const bgMode = mapPrismicSelect<BgMode>(bgModeSelectAlias, bg_mode);
    const itemCount = items.length;

    const mapPromotionItem = (item: CrossPromotionItems) => {
        // get image format
        let imgFormat = mapPrismicSelect(imageFormatAlias, format || 'square');
        const isFull = itemCount === 1 || imgFormat === 'landscape-wide';
        if (isFull) imgFormat = 'landscape-wide';

        // get image format url for landscape
        const imgUrlLandscape =
            item.image && getImg(item.image, imageFormatAlias.landscape).url;

        // get img url from format
        const imgUrl =
            item.image &&
            getImg(item.image, imageFormatAlias?.[imgFormat || 'square']).url;

        return {
            size: isFull ? 'full' : 'half',
            image: {
                ...getImageFromUrls(
                    {
                        small: imgUrlLandscape || '',
                        medium: imgUrlLandscape,
                        semilarge: imgUrl,
                        large: imgUrl,
                        xlarge: imgUrl,
                    },
                    imageSizes[imgFormat || 'square'],
                    getText(item.image?.alt)
                ),
            },
            title: getText(item.title),
            href: resolveUnknownLink(item.link) || '',
        } as PromotionCardProps & { size?: 'full' | 'half' | undefined };
    };

    const mainItems = items.filter((item) => item.is_main);
    const asideItems = items.filter((item) => !item.is_main);

 
    return (
        <CrossPromotion
            isInverted={is_inverted}
            bgMode={bgMode}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            text={getHtmlText(text)}
            main={
                mainItems.length > 0
                    ? mainItems.map((item) => mapPromotionItem(item))
                    : undefined
            }
            aside={
                asideItems.length > 0
                    ? asideItems.map((item) => mapPromotionItem(item))
                    : undefined
            }
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
