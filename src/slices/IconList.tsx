import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isValidAction,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

import { IconList } from '@blateral/b.kit';
import React, { useContext } from 'react';
import { PrismicContext } from 'utils/settings';

interface IconListImages {
    image: PrismicImage;
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
        has_back?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        show_more_text?: PrismicKeyText;
        show_less_text?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
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

export const IconListSlice: React.FC<IconListSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,
        is_centered,
        has_back,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        show_more_text,
        show_less_text,
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    const settingsCtx = useContext(PrismicContext);

    return (
        <IconList
            superTitle={super_title && getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            title={title && getText(title)}
            titleAs={getHeadlineTag(title)}
            text={text && getHtmlText(text)}
            isCentered={is_centered}
            isInverted={is_inverted}
            hasBack={has_back}
            items={items.map((item) => {
                return {
                    src: item?.image?.url || '',
                    alt: item?.image?.alt || '',
                };
            })}
            showMoreText={show_more_text || undefined}
            showLessText={show_less_text || undefined}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href:
                                  resolveUnknownLink(
                                      primary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
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
                              href:
                                  resolveUnknownLink(
                                      secondary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
