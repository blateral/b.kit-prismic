import React from 'react';
import {
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
    getPrismicImage as getImg,
    getImageFromUrls,
    getHeadlineTag,
    isValidAction,
} from 'utils/prismic';

import { Poster } from '@blateral/b.kit';
import { AliasMapperType, ImageSizeSettings } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

interface ImageFormats {
    landscape: string;
    'landscape-wide': string;
}
export interface PosterSliceType extends PrismicSlice<'Poster'> {
    primary: {
        is_active?: PrismicBoolean;

        image?: PrismicImage;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
    };
    // helpers to define component elements outside of slice
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
    main: {
        small: { width: 1023, height: 500 },
        medium: { width: 1023, height: 500 },
        large: { width: 1439, height: 512 },
        xlarge: { width: 2400, height: 854 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const PosterSlice: React.FC<PosterSliceType> = ({
    primary: {
        image,
        super_title,
        title,
        text,
        primary_label,
        secondary_label,
        primary_link,
        secondary_link,
    },
    imageFormatAlias = {
        landscape: '',
        'landscape-wide': 'landscape-wide',
    },
    primaryAction,
    secondaryAction,
}) => {
    // get image urls for different formats / ratios
    const landscapeUrl = image && getImg(image, imageFormatAlias.landscape).url;
    const landscapeWideUrl =
        image && getImg(image, imageFormatAlias['landscape-wide']).url;

    const mappedImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: landscapeWideUrl || '',
                medium: landscapeWideUrl,
                large: landscapeUrl,
                xlarge: landscapeUrl,
            },
            imageSizes.main,
            getText(image?.alt)
        ),
    };

    return (
        <Poster
            image={mappedImage}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            text={getHtmlText(text)}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
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
        />
    );
};
