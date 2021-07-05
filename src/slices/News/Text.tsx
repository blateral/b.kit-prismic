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
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsText } from '@blateral/b.kit';
import React from 'react';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsTextSliceType extends PrismicSlice<'NewsText'> {
    primary: {
        is_active?: PrismicBoolean;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
