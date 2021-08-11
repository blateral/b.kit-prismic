import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    isPrismicLinkExternal,
    mapPrismicSelect,
    resolveUnknownLink,
    getText,
    getHtmlText,
    getHeadlineTag,
    isValidAction,
} from 'utils/prismic';

import { AliasSelectMapperType } from 'utils/mapping';
import { Article } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface ArticleSliceType extends PrismicSlice<'Article'> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        aside_text?: PrismicRichText;
        bg_mode?: PrismicSelectField;
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

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        aside_text,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
}) => {
    const mode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Article
            bgMode={mode}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            text={getHtmlText(text)}
            asideText={getHtmlText(aside_text)}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
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
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
