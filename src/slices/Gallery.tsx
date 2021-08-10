import React from 'react';
import {
    PrismicBoolean,
    PrismicSlice,
    PrismicImage,
    PrismicSelectField,
    mapPrismicSelect,
    getPrismicImage as getImg,
    getImageFromUrls,
    getText,
} from 'utils/prismic';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';

import { Gallery, ImageCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/slick';

type BgMode = 'full' | 'splitted' | 'inverted';
interface ImageFormats {
    square: string;
    landscape: string;
    'landscape-wide': 'landscape-wide';
    portrait: string;
}

export interface GallerySliceType
    extends PrismicSlice<
        'Gallery',
        { image: PrismicImage; format: PrismicSelectField }
    > {
    primary: {
        is_active?: PrismicBoolean;
        is_carousel?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
    controlNext?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        index?: number;
    }) => React.ReactNode;
    beforeChange?: (props: { currentStep: number; nextStep: number }) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
}

// for this component defines image sizes
const imageSizes = {
    square: {
        small: { width: 419, height: 313 },
        medium: { width: 831, height: 624 },
        semilarge: { width: 481, height: 481 },
        large: { width: 686, height: 686 },
        xlarge: { width: 690, height: 690 },
    },
    landscape: {
        small: { width: 419, height: 313 },
        medium: { width: 831, height: 624 },
        semilarge: { width: 983, height: 736 },
        large: { width: 1399, height: 1048 },
        xlarge: { width: 1400, height: 1050 },
    },
    // not available in carousel
    'landscape-wide': {
        small: { width: 419, height: 313 },
        medium: { width: 831, height: 624 },
        semilarge: { width: 983, height: 483 },
        large: { width: 1399, height: 688 },
        xlarge: { width: 1400, height: 690 },
    },
    portrait: {
        small: { width: 419, height: 313 },
        medium: { width: 831, height: 624 },
        semilarge: { width: 481, height: 642 },
        large: { width: 689, height: 919 },
        xlarge: { width: 690, height: 920 },
    },
} as ImageSizeSettings<ImageFormats>;

export const GallerySlice: React.FC<GallerySliceType> = ({
    primary: { is_carousel, bg_mode },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
    },
    imageFormatAlias = {
        square: 'square',
        landscape: 'landscape',
        'landscape-wide': 'landscape-wide',
        portrait: 'portrait',
    },
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
}) => {
    const bgMode = mapPrismicSelect<BgMode>(bgModeSelectAlias, bg_mode);

    // create props object
    const sharedProps = {
        images: items?.map((item) => {
            // get image format
            let imgFormat = mapPrismicSelect(imageFormatAlias, item.format);

            // landscape wide is not allowed in carousel so replace it with normal landscape format
            if (is_carousel && imgFormat === 'landscape-wide')
                imgFormat = 'landscape';

            // get image format url for landscape
            const imgUrlLandscape = getImg(
                item.image,
                imageFormatAlias.landscape
            ).url;

            // get img url from format
            const imgUrl = getImg(
                item.image,
                imageFormatAlias?.[imgFormat || 'square']
            ).url;

            return {
                ...getImageFromUrls(
                    {
                        small: imgUrlLandscape,
                        medium: imgUrlLandscape,
                        semilarge: imgUrl,
                        large: imgUrl,
                        xlarge: imgUrl,
                    },
                    imageSizes[imgFormat || 'square'],
                    getText(item.image.alt)
                ),
                isFull: imgFormat === 'landscape-wide',
            };
        }),
    };

    if (is_carousel) {
        return (
            <ImageCarousel
                {...sharedProps}
                bgMode={bgMode}
                controlNext={controlNext}
                controlPrev={controlPrev}
                beforeChange={beforeChange}
                afterChange={afterChange}
                onInit={onInit}
                dot={dot}
                slidesToShow={slidesToShow}
                responsive={responsive}
            />
        );
    } else {
        return (
            <Gallery
                {...sharedProps}
                bgMode={
                    bgMode === 'full' || bgMode === 'inverted'
                        ? bgMode
                        : undefined
                }
            />
        );
    }
};
