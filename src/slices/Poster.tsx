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
} from '../utils/prismic';

import { Poster } from '@blateral/b.kit';
import React from 'react';

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
