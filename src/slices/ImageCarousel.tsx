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
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { ImageCarousel } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';
type Spacing = 'large' | 'normal';

export interface ImageCarouselSliceType
    extends PrismicSlice<'ImageCarousel', PrismicImage> {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        spacing?: PrismicSelectField;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasMapperType<BgMode>;
    spacingSelectAlias?: AliasMapperType<Spacing>;
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
    controlNext?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    controlPrev?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    dot?: (isInverted?: boolean, isActive?: boolean) => React.ReactNode;
    beforeChange?: (currentStep: number, nextStep: number) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
}

const ImageCarouselSlice: React.FC<ImageCarouselSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        bg_mode,
        spacing,
        is_inverted,
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
    spacingSelectAlias = {
        normal: 'normal',
        large: 'large',
    },
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
}) => {
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
                    small: item?.url || '',
                    medium: item?.Medium?.url || '',
                    large: item?.Large?.url || '',
                    xlarge: item?.ExtraLarge?.url || '',
                    alt: item?.alt && RichText.asText(item.alt),
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
            controlNext={controlNext}
            controlPrev={controlPrev}
            beforeChange={beforeChange}
            afterChange={afterChange}
            onInit={onInit}
            dot={dot}
            slidesToShow={slidesToShow}
        />
    );
};

export default ImageCarouselSlice;
