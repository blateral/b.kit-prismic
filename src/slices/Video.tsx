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
    AliasInterfaceMapperType,
    getSubPrismicImage as getSubImg,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { Video } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

export interface VideoSliceType extends PrismicSlice<'video'> {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        bg_image?: PrismicImage;
        embed_id?: string;
        is_inverted?: PrismicBoolean;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };

    // helpers to define component elements outside of slice
    imageSizeAlias?: AliasInterfaceMapperType<ImageProps>;
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

// default alias mapper objects
const defaultAlias = {
    imageSize: {
        small: '',
        medium: 'medium',
        large: 'large',
        xlarge: 'xlarge',
    },
};
export { defaultAlias as videoDefaultAlias };

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
    imageSizeAlias = { ...defaultAlias.imageSize },
    primaryAction,
    secondaryAction,
    playIcon,
}) => {
    const mappedImage: ImageProps = {
        small: bg_image ? getSubImg(bg_image, imageSizeAlias.small).url : '',
        medium: bg_image && getSubImg(bg_image, imageSizeAlias.medium).url,
        large: bg_image && getSubImg(bg_image, imageSizeAlias.large).url,
        xlarge: bg_image && getSubImg(bg_image, imageSizeAlias.xlarge).url,
        alt: bg_image?.alt && RichText.asText(bg_image.alt),
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
