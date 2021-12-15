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
} from 'utils/prismic';

import { ImageSizeSettings } from 'utils/mapping';
import { NewsImages } from '@blateral/b.kit';
import React, { useContext } from 'react';
import { PrismicContext } from 'utils/settings';

interface ImageFormats {
    half: string;
    full: string;
}

export interface NewsImagesSliceType
    extends PrismicSlice<'NewsImages', { image: PrismicImage }> {
    primary: {
        is_active?: PrismicBoolean;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        imagestyle?: PrismicSelectField;
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

export const NewsImagesSlice: React.FC<NewsImagesSliceType> = ({
    primary: {
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    const settingsCtx = useContext(PrismicContext);

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
            isInverted={is_inverted}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction &&
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href:
                                  resolveUnknownLink(
                                      primary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
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
                              href:
                                  resolveUnknownLink(
                                      secondary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
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
