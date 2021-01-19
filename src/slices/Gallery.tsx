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
    AliasMapperType,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { Gallery } from '@blateral/b.kit';

type Sizes = 'half' | 'full';

export interface GallerySliceType
    extends PrismicSlice<
        'Gallery',
        PrismicImage & { size: PrismicSelectField }
    > {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        has_back?: PrismicBoolean;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };

    // helpers to define component elements outside of slice
    sizeSelectAlias?: AliasMapperType<Sizes>;
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
}

const GallerySlice: React.FC<GallerySliceType> = ({
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
    sizeSelectAlias = {
        full: 'full',
        half: 'half',
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <Gallery
            isInverted={is_inverted}
            hasBack={has_back}
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            images={items.map((item) => {
                return {
                    small: item?.url || '',
                    medium: item?.Medium?.url || '',
                    large: item?.Large?.url || '',
                    xlarge: item?.ExtraLarge?.url || '',
                    alt: item?.alt && RichText.asText(item.alt),
                    size: mapPrismicSelect(sizeSelectAlias, item?.size),
                };
            })}
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

export default GallerySlice;
