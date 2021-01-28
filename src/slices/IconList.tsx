import {
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

import { IconList } from '@blateral/b.kit';
import React from 'react';

interface IconListImages {
    image: PrismicImage;
    size: PrismicSelectField;
}

export interface IconListSliceType
    extends PrismicSlice<'IconList', IconListImages> {
    primary: {
        is_active?: PrismicBoolean;

        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        is_centered?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
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
    primaryAction,
    secondaryAction,
}) => {
    return (
        <IconList
            superTitle={super_title && getText(super_title)}
            title={title && getText(title)}
            text={text && getHtmlText(text)}
            isCentered={is_centered}
            isInverted={is_inverted}
            bgMode={is_inverted ? 'full' : 'splitted'}
            primaryItems={
                items && items.length > 0
                    ? items.map((item) => {
                          return {
                              src: item?.image?.url || '',
                              alt: item?.image?.alt || '',
                          };
                      })
                    : undefined
            }
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    getText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    getText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
