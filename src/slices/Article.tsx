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
    AliasMapperType,
    mapPrismicSelect,
    isPrismicLinkExternal,
} from 'utils/prismic';

import { RichText } from 'prismic-dom';
import { Article } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';

export interface ArticleSliceType extends PrismicSlice<'Article'> {
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

const ArticleSlice: React.FC<ArticleSliceType> = ({
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
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            asideText={RichText.asHtml(aside_text, linkResolver)}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};

export default ArticleSlice;
