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
    isPrismicLinkExternal,
    AliasInterfaceMapperType,
    getSubPrismicImage as getSubImg,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { Gallery } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type Sizes = 'half' | 'full';

export interface GallerySliceType
    extends PrismicSlice<
        'gallery',
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
    imageSizeFullAlias?: AliasInterfaceMapperType<ImageProps>;
    imageSizeHalfAlias?: AliasInterfaceMapperType<ImageProps>;
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
}

// default alias mapper objects
const defaultAlias = {
    sizeSelect: {
        full: 'full',
        half: 'half',
    },
    imageSizeFull: {
        small: '',
        medium: 'full_medium',
        large: 'full_large',
        xlarge: 'full_xlarge',
    },
    imageSizeHalf: {
        small: 'main_half',
        medium: 'half_medium',
        large: 'half_large',
        xlarge: 'half_xlarge',
    },
};
export { defaultAlias as galleryDefaultAlias };

export const GallerySlice: React.FC<GallerySliceType> = ({
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
    sizeSelectAlias = { ...defaultAlias.sizeSelect },
    imageSizeFullAlias = { ...defaultAlias.imageSizeFull },
    imageSizeHalfAlias = { ...defaultAlias.imageSizeHalf },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <Gallery
            isInverted={is_inverted}
            hasBack={has_back}
            title={title && RichText.asText(title)}
            superTitle={super_title && RichText.asText(super_title)}
            text={text && RichText.asHtml(text, linkResolver)}
            images={items.map((item) => {
                const size = mapPrismicSelect(sizeSelectAlias, item?.size);
                const alias =
                    size === 'full' ? imageSizeFullAlias : imageSizeHalfAlias;

                return {
                    small: getSubImg(item, alias.small).url,
                    medium: getSubImg(item, alias.medium).url,
                    large: getSubImg(item, alias.large).url,
                    xlarge: getSubImg(item, alias.xlarge).url,
                    alt: item?.alt && RichText.asText(item.alt),
                    size: size,
                };
            })}
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
