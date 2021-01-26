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
import { AliasMapperType, assignTo } from 'utils/mapping';

import { RichText } from 'prismic-dom';
import { Article } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';

export interface ArticleSliceType extends PrismicSlice<'article'> {
    primary: {
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
    bgModeSelectAlias?: AliasMapperType<BgMode>;
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

// default alias mapper objects
const defaultAlias = {
    bgModeSelect: {
        full: 'full',
        splitted: 'splitted',
    },
};

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
    bgModeSelectAlias,
    primaryAction,
    secondaryAction,
}) => {
    // spread settings props onto default values
    bgModeSelectAlias = assignTo(bgModeSelectAlias, defaultAlias.bgModeSelect);

    return (
        <Article
            isInverted={is_inverted}
            bgMode={mapPrismicSelect<BgMode | undefined>(
                bgModeSelectAlias,
                bg_mode
            )}
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
