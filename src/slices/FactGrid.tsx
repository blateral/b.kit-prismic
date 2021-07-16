import {
    getHeadlineTag,
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
    isValidAction,
} from 'utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactGrid } from '@blateral/b.kit';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
    isSVG,
} from 'utils/mapping';

type BgMode = 'full' | 'splitted';
type Columns = '3' | '4' | '6';
interface ImageFormats {
    landscape: string;
    'landscape-wide': string;
}

interface FactGridEntryItems {
    title?: PrismicKeyText;
    sub_title?: PrismicKeyText;
    text?: PrismicRichText;
    icon?: PrismicImage;
}

export interface FactGridSliceType
    extends PrismicSlice<'FactGrid', FactGridEntryItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicRichText;

        is_inverted?: PrismicBoolean;
        is_centered?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;
        columns?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    columnAlias?: AliasSelectMapperType<Columns>;
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
    landscape: {
        small: { width: 620, height: 310 },
        medium: { width: 250, height: 188 },
        large: { width: 310, height: 233 },
        xlarge: { width: 350, height: 263 },
    },
    'landscape-wide': {
        small: { width: 620, height: 310 },
        medium: { width: 250, height: 125 },
        large: { width: 310, height: 155 },
        xlarge: { width: 350, height: 175 },
    },
} as ImageSizeSettings<ImageFormats>;

export const FactGridSlice: React.FC<FactGridSliceType> = ({
    primary: {
        super_title,
        title,
        intro,
        is_inverted,
        is_centered,
        bg_mode,
        image_format,
        columns,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    imageFormatAlias = {
        landscape: 'landscape',
        'landscape-wide': 'landscape-wide',
    },
    columnAlias = {
        '3': '3',
        '4': '4',
        '6': '6',
    },
    primaryAction,
    secondaryAction,
}) => {
    // get image format for all images
    const imgFormat = mapPrismicSelect(imageFormatAlias, image_format);
    const columnsPerRow = mapPrismicSelect(columnAlias, columns);

    return (
        <FactGrid
            isInverted={is_inverted}
            isCentered={is_centered}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            intro={getHtmlText(intro)}
            columns={columnsPerRow && (parseInt(columnsPerRow) as 3 | 4 | 6)}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
            facts={items?.map(({ title, sub_title, text, icon }) => {
                // get image urls
                const imgUrlDesktop =
                    icon &&
                    getImg(
                        icon,
                        imageFormatAlias?.[imgFormat || 'landscape-wide']
                    ).url;

                const imgUrlMobile =
                    icon &&
                    getImg(icon, imageFormatAlias?.['landscape-wide']).url;

                // check if image urls are path to SVG image
                const isSvgImage = isSVG(imgUrlMobile) || isSVG(imgUrlDesktop);

                return {
                    title: getText(title),
                    subTitle: getText(sub_title),
                    text: getHtmlText(text),
                    image: {
                        ...getImageFromUrls(
                            {
                                small: imgUrlMobile || '',
                                medium: imgUrlDesktop,
                                large: imgUrlDesktop,
                                xlarge: imgUrlDesktop,
                            },
                            imageSizes[imgFormat || 'landscape-wide'],
                            getText(icon?.alt)
                        ),
                        coverSpace: !isSvgImage,
                    },
                };
            })}
        />
    );
};
