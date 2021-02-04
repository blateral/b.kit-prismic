import { Teaser, TeaserWide } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import {
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
    getPrismicImage as getImg,
    getImageFromUrls,
} from 'utils/prismic';

type BgMode = 'full' | 'splitted';

interface ImageFormats {
    square: string;
    landscape: string;
    'landscape-wide': string;
    portrait: string;
}

export interface TeaserSliceType extends PrismicSlice<'Teaser'> {
    primary: {
        is_active?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        is_mirrored?: PrismicBoolean;
        is_wide?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicKeyText;
        text?: PrismicRichText;
        sub_text?: PrismicRichText;
        image?: PrismicImage;
        description?: PrismicRichText;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
    square: {
        small: { width: 619, height: 464 },
        medium: { width: 977, height: 734 },
        semilarge: { width: 791, height: 594 },
        large: { width: 766, height: 766 },
        xlarge: { width: 824, height: 824 },
    },
    landscape: {
        small: { width: 619, height: 464 },
        medium: { width: 977, height: 734 },
        semilarge: { width: 791, height: 594 },
        large: { width: 848, height: 637 },
        xlarge: { width: 917, height: 689 },
    },
    'landscape-wide': {
        small: { width: 619, height: 464 },
        medium: { width: 977, height: 734 },
        semilarge: { width: 791, height: 594 },
        large: { width: 1082, height: 876 },
        xlarge: { width: 1200, height: 971 },
    },
    portrait: {
        small: { width: 619, height: 464 },
        medium: { width: 977, height: 734 },
        semilarge: { width: 791, height: 594 },
        large: { width: 692, height: 923 },
        xlarge: { width: 724, height: 966 },
    },
} as ImageSizeSettings<ImageFormats>;

export const TeaserSlice: React.FC<TeaserSliceType> = ({
    primary: {
        is_inverted,
        is_mirrored,
        is_wide,
        bg_mode,
        image_format,
        super_title,
        title,
        intro,
        text,
        sub_text,
        image,
        description,

        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    imageFormatAlias = {
        square: 'square',
        landscape: 'landscape',
        'landscape-wide': 'landscape-wide',
        portrait: 'portrait',
    },
    primaryAction,
    secondaryAction,
}) => {
    // get image format for all images
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    const imgFormat = mapPrismicSelect(imageFormatAlias, image_format);

    const sharedProps = {
        isInverted: is_inverted,
        isMirrored: is_mirrored,
        superTitle: getText(super_title),
        title: getText(title),
        intro: getText(intro),
        text: getHtmlText(text),
        subText: getHtmlText(sub_text),
        primaryAction: (isInverted: boolean) =>
            primaryAction &&
            primaryAction({
                isInverted,
                label: getText(primary_label),
                href: resolveUnknownLink(primary_link) || '',
                isExternal: isPrismicLinkExternal(primary_link),
            }),
        secondaryAction: (isInverted: boolean) =>
            secondaryAction &&
            secondaryAction({
                isInverted,
                label: getText(secondary_label),
                href: resolveUnknownLink(secondary_link) || '',
                isExternal: isPrismicLinkExternal(secondary_link),
            }),
    };

    // get urls for fixed ratios
    const imgUrlLandscape =
        image && getImg(image, imageFormatAlias?.landscape).url;

    const imgUrlLandscapeWide =
        image && getImg(image, imageFormatAlias?.['landscape-wide']).url;

    // get url for dynamic ratio
    const imgUrl =
        image && getImg(image, imageFormatAlias?.[imgFormat || 'square']).url;

    if (is_wide) {
        return (
            <TeaserWide
                {...sharedProps}
                hasBack={bgMode !== undefined}
                image={{
                    ...getImageFromUrls(
                        {
                            small: imgUrlLandscape || '',
                            medium: imgUrlLandscape,
                            semilarge: imgUrlLandscape,
                            large: imgUrlLandscapeWide,
                            xlarge: imgUrlLandscapeWide,
                        },
                        imageSizes['landscape-wide'],
                        getText(image?.alt)
                    ),
                    description: getHtmlText(description),
                }}
            />
        );
    } else {
        return (
            <Teaser
                {...sharedProps}
                bgMode={bgMode}
                image={{
                    ...getImageFromUrls(
                        {
                            small: imgUrlLandscape || '',
                            medium: imgUrlLandscape,
                            semilarge: imgUrl,
                            large: imgUrl,
                            xlarge: imgUrl,
                        },
                        imageSizes[imgFormat || 'landscape'],
                        getText(image?.alt)
                    ),
                    description: getHtmlText(description),
                }}
            />
        );
    }
};
