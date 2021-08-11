import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    resolveUnknownLink,
    getText,
    PrismicImage,
    PrismicSelectField,
    getImageFromUrl,
    isValidAction,
    mapPrismicSelect,
} from 'utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';
import { NewsImages } from '@blateral/b.kit';
import React from 'react';

interface ImageFormats {
    half: string;
    full: string;
}

type BgMode = 'full' | 'inverted';

export interface NewsImagesSliceType
    extends PrismicSlice<'NewsImages', { image: PrismicImage }> {
    primary: {
        is_active?: PrismicBoolean;
        text?: PrismicRichText;
        bg_mode?: PrismicSelectField;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        imagestyle?: PrismicSelectField;
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
}

export const NewsImagesSlice: React.FC<NewsImagesSliceType> = ({
    primary: {
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    const imageSizes = {
        half: {
            small: { width: 619, height: 465 },
            medium: { width: 376, height: 282 },
            large: { width: 452, height: 339 },
        },
        full: {
            small: { width: 619, height: 305 },
            medium: { width: 929, height: 698 },
        },
    } as ImageSizeSettings<ImageFormats>;

    return (
        <NewsImages
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction &&
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
            images={items?.map((item) => {
                // get image format
                const imageStyle = items.length > 1 ? 'half' : 'full';

                // get image format url for landscape
                const imgUrl = getImg(item.image, imageStyle).url;

                return {
                    ...getImageFromUrl(
                        imgUrl,
                        imageSizes[imageStyle || 'half'],
                        getText(item.image.alt)
                    ),
                    isFull: imageStyle === 'full',
                };
            })}
        />
    );
};
