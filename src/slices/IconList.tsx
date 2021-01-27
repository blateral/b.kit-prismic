import {
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
import { RichText } from 'prismic-dom';

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
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    primary_label ? RichText.asText(primary_label) : '',
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    secondary_label ? RichText.asText(secondary_label) : '',
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
