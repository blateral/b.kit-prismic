import React from 'react';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    PrismicLink,
    PrismicImage,
    PrismicSelectField,
    AliasMapperType,
    mapPrismicSelect,
    linkResolver,
    resolveUnknownLink,
    isPrismicLinkExternal,
    AliasInterfaceMapperType,
    getSubPrismicImage as getSubImg,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { ImageCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/carousels/slick';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode = 'full' | 'splitted';
type Spacing = 'large' | 'normal';
type ImageFormat = 'square' | 'wide' | 'tall';

export interface ImageCarouselSliceType
    extends PrismicSlice<'imagecarousel', PrismicImage> {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        spacing?: PrismicSelectField;
        image_format?: PrismicSelectField;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasMapperType<BgMode>;
    spacingSelectAlias?: AliasMapperType<Spacing>;
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
    controlNext?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    controlPrev?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    dot?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    beforeChange?: (currentStep: number, nextStep: number) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
}

const defaultAlias = {
    bgModeSelect: {
        full: 'full',
        splitted: 'splitted',
    },
    spacingSelect: {
        normal: 'normal',
        large: 'large',
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
export { defaultAlias as imageCarouselDefaultAlias };

export const ImageCarouselSlice: React.FC<ImageCarouselSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        bg_mode,
        image_format,
        spacing,
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = { ...defaultAlias.bgModeSelect },
    spacingSelectAlias = { ...defaultAlias.spacingSelect },
    imgFormatSelectAlias = { ...defaultAlias.imgFormatSelect },
    imageSizeAlias = { ...defaultAlias.imageSize },
    imageSizeWideAlias = { ...defaultAlias.imageSizeWide },
    imageSizeTallAlias = { ...defaultAlias.imageSizeTall },
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
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
        <ImageCarousel
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            spacing={mapPrismicSelect(spacingSelectAlias, spacing)}
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            images={items.map((item) => {
                return {
                    small: getSubImg(item, imgAlias.small).url,
                    medium: getSubImg(item, imgAlias.medium).url,
                    large: getSubImg(item, imgAlias.large).url,
                    xlarge: getSubImg(item, imgAlias.xlarge).url,
                    alt: item?.alt && RichText.asText(item.alt),
                };
            })}
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
};
