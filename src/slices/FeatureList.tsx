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
} from 'utils/prismic';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';

import { FeatureList } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';
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
    primary_label?: string;
    secondary_label?: string;
}

export interface FeatureListSliceType
    extends PrismicSlice<'FeatureList', FeatureItemType> {
    primary: {
        is_active?: PrismicBoolean;
        title?: PrismicHeading;
        super_title?: PrismicRichText;
        text?: PrismicRichText;

        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
    secondaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
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
    primary: {
        title,
        super_title,
        text,
        is_inverted,
        bg_mode,
        image_format,
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
    imageFormatAlias = {
        square: 'square',
        landscape: 'landscape',
        portrait: 'portrait',
    },
    primaryAction,
    secondaryAction,
}) => {
    // get image format for all images
    const imgFormat = mapPrismicSelect(imageFormatAlias, image_format);

    return (
        <FeatureList
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            title={getText(title)}
            superTitle={getText(super_title)}
            text={getHtmlText(text)}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    getText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    getText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
            features={items.map(
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
                        },

                        primaryAction: (isInverted) =>
                            primaryAction &&
                            primaryAction(
                                isInverted,
                                getText(primary_label),
                                resolveUnknownLink(primary_link) || '',
                                isPrismicLinkExternal(primary_link)
                            ),
                        secondaryAction: (isInverted) =>
                            secondaryAction &&
                            secondaryAction(
                                isInverted,
                                getText(secondary_label),
                                resolveUnknownLink(secondary_link) || '',
                                isPrismicLinkExternal(secondary_link)
                            ),
                    };
                }
            )}
        />
    );
};
