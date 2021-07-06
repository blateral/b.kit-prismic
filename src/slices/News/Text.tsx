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
} from 'utils/prismic';

import { NewsText } from '@blateral/b.kit';
import React from 'react';

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
    return (
        <NewsText
            text={getHtmlText(text)}
            isInverted={is_inverted}
            hasBack={has_background}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: getText(secondary_label),
                    href: resolveUnknownLink(secondary_link) || '',
                    isExternal: isPrismicLinkExternal(secondary_link),
                })
            }
        />
    );
};
