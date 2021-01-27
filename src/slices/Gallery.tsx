import React from 'react';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    linkResolver,
    PrismicLink,
    resolveUnknownLink,
    PrismicImage,
    PrismicSelectField,
    mapPrismicSelect,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getImageFromUrl,
    PrismicKeyText,
} from 'utils/prismic';
import { AliasMapperType, ImageSizeSettings } from 'utils/mapping';

import { RichText } from 'prismic-dom';
import { Gallery } from '@blateral/b.kit';

interface ImageFormats {
    'full-width': string;
    'half-width': string;
}

export interface GallerySliceType
    extends PrismicSlice<
        'Gallery',
        { image: PrismicImage; size: PrismicSelectField }
    > {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        has_back?: PrismicBoolean;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
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
    'full-width': {
        small: { width: 500, height: 246 },
        medium: { width: 640, height: 315 },
        large: { width: 1024, height: 504 },
        xlarge: { width: 1440, height: 710 },
    },
    'half-width': {
        small: { width: 610, height: 457 },
        medium: { width: 507, height: 380 },
        large: { width: 507, height: 380 },
        xlarge: { width: 710, height: 533 },
    },
} as ImageSizeSettings<ImageFormats>;

export const GallerySlice: React.FC<GallerySliceType> = ({
    primary: {
        super_title,
        title,
        text,
        has_back,
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    imageFormatAlias = {
        'full-width': '',
        'half-width': 'half-width',
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <Gallery
            isInverted={is_inverted}
            hasBack={has_back}
            title={title && RichText.asText(title)}
            superTitle={super_title && RichText.asText(super_title)}
            text={text && RichText.asHtml(text, linkResolver)}
            images={items.map((item) => {
                // get image format
                const format = mapPrismicSelect(imageFormatAlias, item?.size);

                // get image url
                const url = getImg(
                    item.image,
                    imageFormatAlias?.[format || 'full-width']
                ).url;

                return {
                    ...getImageFromUrl(
                        url,
                        imageSizes[format || 'full-width'],
                        item?.image.alt && RichText.asText(item.image.alt)
                    ),
                    size: format === 'half-width' ? 'half' : 'full',
                };
            })}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    (primary_label && RichText.asText(primary_label)) || '',
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    (secondary_label && RichText.asText(secondary_label)) || '',
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
