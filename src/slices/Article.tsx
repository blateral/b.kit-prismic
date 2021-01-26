import React from 'react';

import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    linkResolver,
    PrismicLink,
    resolveUnknownLink,
    PrismicSelectField,
    mapPrismicSelect,
    isPrismicLinkExternal,
} from 'utils/prismic';
import { AliasSelectMapperType } from 'utils/mapping';

import { RichText } from 'prismic-dom';
import { Article } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';

export interface ArticleSliceType extends PrismicSlice<'Article'> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        aside_text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        aside_text,
        is_inverted,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <Article
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            title={title && RichText.asText(title)}
            superTitle={super_title && RichText.asText(super_title)}
            text={text && RichText.asHtml(text, linkResolver)}
            asideText={aside_text && RichText.asHtml(aside_text, linkResolver)}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    primary_label && RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    secondary_label && RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
