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
    getImageFromUrl,
} from '../utils/prismic';

import { Poster } from '@blateral/b.kit';
import React from 'react';
import { ImageSizeSettings } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

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
    primaryAction?: (
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
    secondaryAction?: (
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 680, height: 300 },
        medium: { width: 680, height: 300 },
        large: { width: 1024, height: 364 },
        xlarge: { width: 2400, height: 854 },
    },
} as ImageSizeSettings<{ main: string }>;

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
    primaryAction,
    secondaryAction,
}) => {
    // get image url
    const url = image ? getImg(image, 'main').url : '';

    const mappedImage: ImageProps = {
        ...getImageFromUrl(url, imageSizes.main, getText(image?.alt)),
    };

    return (
        <Poster
            image={mappedImage}
            title={getText(title)}
            superTitle={getText(super_title)}
            text={getHtmlText(text)}
            primaryAction={
                primaryAction &&
                primaryAction(
                    getText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={
                secondaryAction &&
                secondaryAction(
                    getText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
