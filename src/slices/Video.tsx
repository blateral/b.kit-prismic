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
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { Video } from '@blateral/b.kit';

export interface VideoSliceType extends PrismicSlice<'Video'> {
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
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string
    ) => React.ReactNode;
    secondaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string
    ) => React.ReactNode;
    playIcon?: React.ReactChild;
}

const VideoSlice: React.FC<VideoSliceType> = ({
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
    return (
        <Video
            isInverted={is_inverted}
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            bgImage={{
                small: bg_image?.url || '',
                medium: bg_image?.Medium?.url || '',
                large: bg_image?.Large?.url || '',
                xlarge: bg_image?.ExtraLarge?.url || '',
                alt: bg_image?.alt && RichText.asText(bg_image.alt),
            }}
            embedId={RichText.asText(embed_id)}
            playIcon={playIcon}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || ''
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || ''
                )
            }
        />
    );
};

export default VideoSlice;
