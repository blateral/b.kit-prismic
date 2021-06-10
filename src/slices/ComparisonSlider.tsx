import {
    getText,
    PrismicBoolean,
    PrismicImage,
    PrismicKeyText,
    PrismicSlice,
    getPrismicImage as getImg,
    getImageFromUrls,
    PrismicSelectField,
    mapPrismicSelect,
} from '../utils/prismic';

import { ComparisonSlider } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

interface ImageFormats {
    landscape: string;
    'landscape-wide': string;
}

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface ComparisonSliderSliceType
    extends PrismicSlice<'ComparisonSlider'> {
    primary: {
        is_active?: PrismicBoolean;

        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        foreground_img?: PrismicImage;
        background_img?: PrismicImage;
        foreground_label?: PrismicKeyText;
        background_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
    initalValue?: number;
    overlayColor?: string;
    labelColor?: string;
    dragControl?: React.ReactNode;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 1023, height: 500 },
        medium: { width: 1023, height: 500 },
        large: { width: 1439, height: 512 },
        xlarge: { width: 2400, height: 854 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const ComparisonSliderSlice: React.FC<ComparisonSliderSliceType> = ({
    primary: {
        is_inverted,
        bg_mode,
        foreground_img,
        foreground_label,
        background_img,
        background_label,
    },
    imageFormatAlias = {
        landscape: '',
        'landscape-wide': 'landscape-wide',
    },
    bgModeSelectAlias = {
        full: 'full',
        'half-right': 'splitted',
        'half-left': 'splitted',
        'larger-left': 'splitted',
        'larger-right': 'splitted',
    },
    initalValue,
    overlayColor,
    labelColor,
    dragControl,
}) => {
    // get image urls for different formats / ratios
    const landscapeUrlForeground =
        foreground_img &&
        getImg(foreground_img, imageFormatAlias.landscape).url;
    const landscapeUrlBackground =
        background_img &&
        getImg(background_img, imageFormatAlias.landscape).url;
    const landscapeWideUrlForeground =
        foreground_img &&
        getImg(foreground_img, imageFormatAlias['landscape-wide']).url;
    const landscapeWideUrlBackground =
        background_img &&
        getImg(background_img, imageFormatAlias['landscape-wide']).url;

    const mappedForegroundImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: landscapeWideUrlForeground || '',
                medium: landscapeWideUrlForeground,
                large: landscapeUrlForeground,
                xlarge: landscapeUrlForeground,
            },
            imageSizes.main,
            getText(foreground_img?.alt)
        ),
    };

    const mappedBackgroundImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: landscapeWideUrlBackground || '',
                medium: landscapeWideUrlBackground,
                large: landscapeUrlBackground,
                xlarge: landscapeUrlBackground,
            },
            imageSizes.main,
            getText(background_img?.alt)
        ),
    };

    return (
        <ComparisonSlider
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            initialValue={initalValue}
            foregroundImg={mappedForegroundImage}
            backgroundImg={mappedBackgroundImage}
            foregroundLabel={getText(foreground_label)}
            backgroundLabel={getText(background_label)}
            overlayColor={overlayColor}
            labelColor={labelColor}
            dragControl={dragControl}
        />
    );
};
