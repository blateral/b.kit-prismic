import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    isPrismicLinkExternal,
    resolveUnknownLink,
    getText,
    getHtmlText,
    isValidAction,
} from 'utils/prismic';

import { NewsText } from '@blateral/b.kit';
import React, { useContext } from 'react';
import { PrismicContext } from 'utils/settings';

export interface NewsTextSliceType extends PrismicSlice<'NewsText'> {
    primary: {
        is_active?: PrismicBoolean;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        has_background?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

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

export const NewsTextSlice: React.FC<NewsTextSliceType> = ({
    primary: {
        text,
        is_inverted,
        has_background,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
}) => {
    const settingsCtx = useContext(PrismicContext);

    return (
        <NewsText
            text={getHtmlText(text)}
            isInverted={is_inverted}
            hasBack={has_background}
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
