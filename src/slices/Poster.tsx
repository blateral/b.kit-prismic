import {
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

import { Poster } from '@blateral/b.kit';
import React from 'react';
import { RichText } from 'prismic-dom';

export interface PosterSliceType extends PrismicSlice<'Article'> {
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
    return (
        //TODO: Image sizes
        <Poster
            image={{ small: (image && image.url) || '' }}
            title={title && RichText.asText(title)}
            superTitle={super_title && RichText.asText(super_title)}
            text={text && RichText.asHtml(text)}
            primaryAction={
                primaryAction &&
                primaryAction(
                    primary_label ? RichText.asText(primary_label) : '',
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={
                secondaryAction &&
                secondaryAction(
                    secondary_label ? RichText.asText(secondary_label) : '',
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
