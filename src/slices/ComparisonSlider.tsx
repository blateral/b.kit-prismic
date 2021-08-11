import {
    getText,
    PrismicBoolean,
    PrismicImage,
    PrismicKeyText,
    PrismicSlice,
    getPrismicImage as getImg,
    PrismicSelectField,
    mapPrismicSelect,
    getImageFromUrl,
} from 'utils/prismic';

import { ComparisonSlider } from '@blateral/b.kit';
import React from 'react';
import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface ComparisonSliderSliceType
    extends PrismicSlice<'ComparisonSlider'> {
    primary: {
        is_active?: PrismicBoolean;

        bg_mode?: PrismicSelectField;
        has_anim?: PrismicBoolean;
        foreground_img?: PrismicImage;
        background_img?: PrismicImage;
        foreground_label?: PrismicKeyText;
        background_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    initalValue?: number;
    overlayColor?: string;
    labelColor?: string;
    dragControl?: React.ReactNode;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 640, height: 480 },
        medium: { width: 1024, height: 576 },
        large: { width: 1440, height: 810 },
        xlarge: { width: 1680, height: 810 },
    },
} as ImageSizeSettings<{ main: string }>;

export const ComparisonSliderSlice: React.FC<ComparisonSliderSliceType> = ({
    primary: {
        bg_mode,
        has_anim,
        foreground_img,
        foreground_label,
        background_img,
        background_label,
    },
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
    },
    initalValue,
    overlayColor,
    labelColor,
    dragControl,
}) => {
    // get image urls for different formats / ratios
    const foregroundUrl = foreground_img
        ? getImg(foreground_img, 'main').url
        : '';

    const backgroundUrl = background_img
        ? getImg(background_img, 'main').url
        : '';

    const mappedForegroundImage: ImageProps = {
        ...getImageFromUrl(
            foregroundUrl,
            imageSizes.main,
            getText(foreground_img?.alt)
        ),
    };
    const mappedBackgroundImage: ImageProps = {
        ...getImageFromUrl(
            backgroundUrl,
            imageSizes.main,
            getText(background_img?.alt)
        ),
    };

    return (
        <ComparisonSlider
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            initialValue={initalValue}
            foregroundImg={mappedForegroundImage}
            backgroundImg={mappedBackgroundImage}
            foregroundLabel={getText(foreground_label)}
            backgroundLabel={getText(background_label)}
            overlayColor={overlayColor}
            labelColor={labelColor}
            dragControl={dragControl}
            enableControlAnim={has_anim}
        />
    );
};
