import React from 'react';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    PrismicLink,
    PrismicImage,
    PrismicSelectField,
    mapPrismicSelect,
    resolveUnknownLink,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getImageFromUrls,
    PrismicKeyText,
    getText,
    getHtmlText,
} from 'utils/prismic';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';

import { ImageCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/carousels/slick';

type BgMode = 'full' | 'splitted';
type Spacing = 'large' | 'normal';
interface ImageFormats {
    square: string;
    landscape: string;
    portrait: string;
}

export interface ImageCarouselSliceType
    extends PrismicSlice<'ImageCarousel', { image: PrismicImage }> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        spacing?: PrismicSelectField;
        image_format?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    spacingSelectAlias?: AliasSelectMapperType<Spacing>;
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
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
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
        small: { width: 553, height: 431 },
        medium: { width: 357, height: 357 },
        large: { width: 507, height: 507 },
        xlarge: { width: 680, height: 680 },
    },
    landscape: {
        small: { width: 553, height: 431 },
        medium: { width: 357, height: 278 },
        large: { width: 507, height: 395 },
        xlarge: { width: 680, height: 529 },
    },
    portrait: {
        small: { width: 553, height: 431 },
        medium: { width: 357, height: 476 },
        large: { width: 507, height: 676 },
        xlarge: { width: 680, height: 906 },
    },
} as ImageSizeSettings<ImageFormats>;

export const ImageCarouselSlice: React.FC<ImageCarouselSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        bg_mode,
        image_format,
        spacing,
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    spacingSelectAlias = {
        normal: 'normal',
        large: 'large',
    },
    imageFormatAlias = {
        square: 'square',
        landscape: 'landscape',
        portrait: 'portrait',
    },
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

    return (
        <ImageCarousel
            isInverted={is_inverted}
            bgMode={mapPrismicSelect<BgMode>(bgModeSelectAlias, bg_mode)}
            spacing={mapPrismicSelect<Spacing>(spacingSelectAlias, spacing)}
            title={getText(title)}
            superTitle={getText(super_title)}
            text={getHtmlText(text)}
            images={items.map((item) => {
                // get image urls
                const imgUrlLandscape = getImg(
                    item.image,
                    imageFormatAlias.landscape
                ).url;

                const imgUrl = getImg(
                    item.image,
                    imageFormatAlias?.[imgFormat || 'square']
                ).url;

                return {
                    ...getImageFromUrls(
                        {
                            small: imgUrlLandscape,
                            medium: imgUrl,
                            large: imgUrl,
                            xlarge: imgUrl,
                        },
                        imageSizes[imgFormat || 'square'],
                        getText(item.image.alt)
                    ),
                };
            })}
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
