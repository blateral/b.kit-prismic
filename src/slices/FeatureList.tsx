import React from 'react';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    PrismicLink,
    resolveUnknownLink,
    PrismicImage,
    PrismicSelectField,
    mapPrismicSelect,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getImageFromUrls,
    PrismicKeyText,
    getText,
    getHtmlText,
    isValidAction,
} from 'utils/prismic';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
    isSVG,
} from 'utils/mapping';

import { FeatureCarousel, FeatureList } from '@blateral/b.kit';
import { ResponsiveObject } from './slick';

type BgMode = 'full' | 'splitted' | 'inverted';
interface ImageFormats {
    square: string;
    landscape: string;
    portrait: string;
}

interface FeatureItemType {
    title?: PrismicHeading;
    text?: PrismicRichText;

    description?: PrismicRichText;
    intro?: PrismicRichText;
    image: PrismicImage;

    primary_link?: PrismicLink;
    secondary_link?: PrismicLink;
    primary_label?: PrismicKeyText;
    secondary_label?: PrismicKeyText;
}

export interface FeatureListSliceType
    extends PrismicSlice<'FeatureList', FeatureItemType> {
    primary: {
        is_active?: PrismicBoolean;
        is_carousel?: PrismicBoolean;

        is_centered?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;
    };

    // helpers to define elements outside of slice
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
        small: { width: 599, height: 450 },
        medium: { width: 789, height: 789 },
        large: { width: 591, height: 591 },
        xlarge: { width: 592, height: 592 },
    },
    landscape: {
        small: { width: 599, height: 450 },
        medium: { width: 688, height: 593 },
        large: { width: 591, height: 444 },
        xlarge: { width: 592, height: 445 },
    },
    portrait: {
        small: { width: 599, height: 450 },
        medium: { width: 791, height: 1070 },
        large: { width: 591, height: 801 },
        xlarge: { width: 592, height: 802 },
    },
} as ImageSizeSettings<ImageFormats>;

export const FeatureListSlice: React.FC<FeatureListSliceType> = ({
    primary: { is_carousel, is_centered, bg_mode, image_format },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
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
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    const sharedProps = {
        isCentered: is_centered,
        features: items.map(
            ({
                title,
                text,
                description,
                intro,
                image,
                primary_label,
                primary_link,
                secondary_label,
                secondary_link,
            }) => {
                // get image urls
                const imgUrlLandscape = getImg(
                    image,
                    imageFormatAlias?.landscape
                ).url;

                const imgUrl = getImg(
                    image,
                    imageFormatAlias?.[imgFormat || 'square']
                ).url;

                // check if image urls are path to SVG image
                const isSvgImage = isSVG(imgUrl) || isSVG(imgUrlLandscape);

                return {
                    title: getText(title),
                    text: getHtmlText(text),
                    description: getHtmlText(description),
                    intro: getHtmlText(intro),
                    image: {
                        ...getImageFromUrls(
                            {
                                small: imgUrlLandscape,
                                medium: imgUrl,
                                large: imgUrl,
                                xlarge: imgUrl,
                            },
                            imageSizes[imgFormat || 'square'],
                            getText(image.alt)
                        ),
                        coverSpace: !isSvgImage,
                    },
                    primaryAction:
                        primaryAction &&
                        isValidAction(primary_label, primary_link)
                            ? (isInverted: boolean) =>
                                  primaryAction({
                                      isInverted,
                                      label: getText(primary_label),
                                      href:
                                          resolveUnknownLink(primary_link) ||
                                          '',
                                      isExternal:
                                          isPrismicLinkExternal(primary_link),
                                  })
                            : undefined,
                    secondaryAction:
                        secondaryAction &&
                        isValidAction(secondary_label, secondary_link)
                            ? (isInverted: boolean) =>
                                  secondaryAction({
                                      isInverted,
                                      label: getText(secondary_label),
                                      href:
                                          resolveUnknownLink(secondary_link) ||
                                          '',
                                      isExternal:
                                          isPrismicLinkExternal(secondary_link),
                                  })
                            : undefined,
                };
            }
        ),
    };

    if (is_carousel) {
        return (
            <FeatureCarousel
                {...sharedProps}
                bgMode={bgMode}
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
    } else {
        return <FeatureList {...sharedProps} bgMode={bgMode} />;
    }
};
