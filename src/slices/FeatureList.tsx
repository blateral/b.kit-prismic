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
    AliasMapperType,
    PrismicSelectField,
    mapPrismicSelect,
    isPrismicLinkExternal,
    AliasInterfaceMapperType,
    getSubPrismicImage as getSubImg,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { FeatureList } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode = 'full' | 'splitted';
type ImageFormat = 'square' | 'wide' | 'tall';

export interface FeatureListSliceType extends PrismicSlice<'featurelist'> {
    primary: {
        title?: PrismicHeading;
        super_title?: PrismicRichText;
        text?: PrismicRichText;

        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
    items: {
        title?: PrismicHeading;
        text?: PrismicRichText;

        description?: PrismicRichText;
        intro?: PrismicRichText;
        image: PrismicImage;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    }[];

    // helpers to define elements outside of slice
    bgModeSelectAlias?: AliasMapperType<BgMode>;
    imgFormatSelectAlias?: AliasMapperType<ImageFormat>;
    imageSizeAlias?: AliasInterfaceMapperType<ImageProps>; // alias for image square
    imageSizeWideAlias?: AliasInterfaceMapperType<ImageProps>; // alias for image 4:3
    imageSizeTallAlias?: AliasInterfaceMapperType<ImageProps>; // alias for image 3:4
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
    bgModeSelect: {
        full: 'full',
        splitted: 'splitted',
    },
    imgFormatSelect: {
        square: 'square',
        tall: '3:4',
        wide: '4:3',
    },
    imageSize: {
        small: '',
        medium: 'medium',
        large: 'large',
        xlarge: 'xlarge',
    },
    imageSizeWide: {
        small: 'main_wide',
        medium: 'wide_medium',
        large: 'wide_large',
        xlarge: 'wide_xlarge',
    },
    imageSizeTall: {
        small: 'main_tall',
        medium: 'tall_medium',
        large: 'tall_large',
        xlarge: 'tall_xlarge',
    },
};
export { defaultAlias as featureListDefaultAlias };

export const FeatureListSlice: React.FC<FeatureListSliceType> = ({
    primary: {
        title,
        super_title,
        text,
        is_inverted,
        bg_mode,
        image_format,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = { ...defaultAlias.bgModeSelect },
    imgFormatSelectAlias = { ...defaultAlias.imgFormatSelect },
    imageSizeAlias = { ...defaultAlias.imageSize },
    imageSizeWideAlias = { ...defaultAlias.imageSizeWide },
    imageSizeTallAlias = { ...defaultAlias.imageSizeTall },
    primaryAction,
    secondaryAction,
}) => {
    // get image format for all images
    const imgFormat = mapPrismicSelect(imgFormatSelectAlias, image_format);

    // set correct size alias mapper for all images
    let imgAlias = imageSizeAlias;
    switch (imgFormat) {
        case 'wide':
            imgAlias = imageSizeWideAlias;
            break;
        case 'tall':
            imgAlias = imageSizeTallAlias;
    }

    return (
        <FeatureList
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
            features={items.map(
                ({
                    title,
                    text,
                    description,
                    intro,
                    image,
                    primary_label,
                    primary_link,
                    secondary_label,
                    secondary_link,
                }) => {
                    return {
                        title: RichText.asText(title),
                        text: RichText.asHtml(text),
                        description: RichText.asHtml(description, linkResolver),
                        intro: RichText.asHtml(intro),

                        image: {
                            small: getSubImg(image, imgAlias.small).url,
                            medium: getSubImg(image, imgAlias.medium).url,
                            large: getSubImg(image, imgAlias.large).url,
                            xlarge: getSubImg(image, imgAlias.xlarge).url,
                            alt: image?.alt && RichText.asText(image.alt),
                        },

                        primaryAction: (isInverted) =>
                            primaryAction &&
                            primaryAction(
                                isInverted,
                                RichText.asText(primary_label),
                                resolveUnknownLink(primary_link) || '',
                                isPrismicLinkExternal(primary_link)
                            ),
                        secondaryAction: (isInverted) =>
                            secondaryAction &&
                            secondaryAction(
                                isInverted,
                                RichText.asText(secondary_label),
                                resolveUnknownLink(secondary_link) || '',
                                isPrismicLinkExternal(secondary_link)
                            ),
                    };
                }
            )}
        />
    );
};
