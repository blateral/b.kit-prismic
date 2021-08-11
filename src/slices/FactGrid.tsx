import {
    getHtmlText,
    getText,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicImage,
    PrismicKeyText,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    getPrismicImage as getImg,
    getImageFromUrls,
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

type BgMode = 'full' | 'splitted' | 'inverted';
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

        is_centered?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        image_format?: PrismicSelectField;
        columns?: PrismicSelectField;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    columnAlias?: AliasSelectMapperType<Columns>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
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
    primary: { is_centered, bg_mode, image_format, columns },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
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
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    // get image format for all images
    const imgFormat = mapPrismicSelect(imageFormatAlias, image_format);
    const columnsPerRow = mapPrismicSelect(columnAlias, columns);

    return (
        <FactGrid
            isCentered={is_centered}
            bgMode={bgMode}
            columns={columnsPerRow && (parseInt(columnsPerRow) as 3 | 4 | 6)}
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
