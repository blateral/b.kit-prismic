import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    PrismicImage,
    isPrismicLinkExternal,
    resolveUnknownLink,
    getText,
    getHtmlText,
    mapPrismicSelect,
    getPrismicImage as getImg,
    getImageFromUrls,
    getHeadlineTag,
} from '../utils/prismic';

import { PromotionCarousel } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import { ResponsiveObject } from './slick';

type BgMode = 'full' | 'splitted';
interface ImageFormats {
    square: string;
    landscape: string;
    portrait: string;
}

interface CrossPromotionItems {
    image?: PrismicImage;
    title?: PrismicHeading;
    link?: PrismicLink;
}

export interface PromotionCarouselSliceType
    extends PrismicSlice<'PromotionCarousel', CrossPromotionItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;

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

    controlNext?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        index?: number;
    }) => React.ReactNode;
    beforeChange?: (props: { currentStep: number; nextStep: number }) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
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
    portrait: {
        small: { width: 619, height: 464 },
        medium: { width: 791, height: 593 },
        semilarge: { width: 689, height: 1054 },
        large: { width: 790, height: 1054 },
        xlarge: { width: 790, height: 1055 },
    },
} as ImageSizeSettings<ImageFormats>;

export const PromotionCarouselSlice: React.FC<PromotionCarouselSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,
        bg_mode,
        image_format,
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
        portrait: 'portrait',
    },
    items,
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
}) => {
    // get image format for all images
    const imgFormat = mapPrismicSelect(imageFormatAlias, image_format);
    const bgMode = mapPrismicSelect<BgMode>(bgModeSelectAlias, bg_mode);

    return (
        <PromotionCarousel
            bgMode={bgMode}
            isInverted={is_inverted}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            text={getHtmlText(text)}
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
            promotions={items.map(({ image, title, link }) => {
                // get image urls
                const imgUrlLandscape =
                    image && getImg(image, imageFormatAlias?.landscape).url;

                const imgUrl =
                    image &&
                    getImg(image, imageFormatAlias?.[imgFormat || 'square'])
                        .url;

                return {
                    href: resolveUnknownLink(link) || '',
                    title: getText(title),
                    image: {
                        ...getImageFromUrls(
                            {
                                small: imgUrlLandscape || '',
                                medium: imgUrl,
                                large: imgUrl,
                                xlarge: imgUrl,
                            },
                            imageSizes[imgFormat || 'square'],
                            getText(image?.alt)
                        ),
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
            beforeChange={beforeChange}
            afterChange={afterChange}
            onInit={onInit}
            dot={dot}
            slidesToShow={slidesToShow}
            responsive={responsive}
        />
    );
};
