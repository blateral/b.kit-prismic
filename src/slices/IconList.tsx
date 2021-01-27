import { Gallery, IconList } from '@blateral/b.kit';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
} from '../utils/prismic';

import { ImageSizeSettings } from '../utils/mapping';
import React from 'react';
import { RichText } from 'prismic-dom';

interface ImageFormats {
    'full-width': string;
    'half-width': string;
}

interface IconListImages {
    image: PrismicImage;
    size: PrismicSelectField;
}

export interface IconListSliceType
    extends PrismicSlice<'IconList', IconListImages> {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        is_centered?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
}

// for this component defines image sizes
const imageSizes = {
    'full-width': {
        small: { width: 500, height: 246 },
        medium: { width: 640, height: 315 },
        large: { width: 1024, height: 504 },
        xlarge: { width: 1440, height: 710 },
    },
    'half-width': {
        small: { width: 610, height: 457 },
        medium: { width: 507, height: 380 },
        large: { width: 507, height: 380 },
        xlarge: { width: 710, height: 533 },
    },
} as ImageSizeSettings<ImageFormats>;

export const IconListSlice: React.FC<IconListSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,
        is_centered,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
}) => {
    return (
        <IconList
            superTitle={super_title && RichText.asText(super_title)}
            title={title && RichText.asText(title)}
            text={text && RichText.asHtml(text)}
            isCentered={is_centered}
            isInverted={is_inverted}
            bgMode={is_inverted ? 'full' : 'splitted'}
            secondaryItems={
                items && items.length > 0
                    ? items.map((item) => {
                          return {
                              src: item?.image?.url || '',
                              alt: item?.image?.alt || '',
                          };
                      })
                    : undefined
            }
        />
    );
};
