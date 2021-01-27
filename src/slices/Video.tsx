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
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getImageFromUrl,
} from 'utils/prismic';
import { ImageSizeSettings } from 'utils/mapping';

import { RichText } from 'prismic-dom';
import { Video } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
export interface VideoSliceType extends PrismicSlice<'Video'> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        bg_image?: PrismicImage;
        embed_id?: string;
        is_inverted?: PrismicBoolean;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: string;
        secondary_label?: string;
    };

    // helpers to define component elements outside of slice
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
    playIcon?: React.ReactChild;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 640, height: 480 },
        medium: { width: 1024, height: 576 },
        large: { width: 1440, height: 810 },
        xlarge: { width: 1680, height: 810 },
    },
} as ImageSizeSettings<{ main: string }>;

export const VideoSlice: React.FC<VideoSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        bg_image,
        embed_id,
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
    playIcon,
}) => {
    // get image url
    const url = bg_image ? getImg(bg_image, 'main').url : '';

    const mappedImage: ImageProps = {
        ...getImageFromUrl(
            url,
            imageSizes.main,
            bg_image?.alt && RichText.asText(bg_image.alt)
        ),
    };

    return (
        <Video
            isInverted={is_inverted}
            title={title && RichText.asText(title)}
            superTitle={super_title && RichText.asText(super_title)}
            text={text && RichText.asHtml(text, linkResolver)}
            bgImage={mappedImage}
            embedId={embed_id ? RichText.asText(embed_id) : ''}
            playIcon={playIcon}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    primary_label && RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    secondary_label && RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
