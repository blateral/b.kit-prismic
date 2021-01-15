import React from 'react';

import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    linkResolver,
    PrismicLink,
    resolveUnknownLink,
} from '../utils/prismic';

import { RichText } from 'prismic-dom';
import { Article } from '@blateral/b.kit';
import { Button } from '@blateral/b.kit';

export interface ArticleSliceType extends PrismicSlice<'artikel'> {
    primary: {
        suptitle?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        aside_text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: 'full' | 'splitted';
        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
}

const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary: {
        suptitle,
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
}) => {
    return (
        <Article
            bgMode={bg_mode}
            title={RichText.asText(title)}
            superTitle={RichText.asText(suptitle)}
            text={RichText.asHtml(text, linkResolver)}
            asideText={RichText.asHtml(aside_text, linkResolver)}
            isInverted={is_inverted}
            primaryAction={(is_inverted) => (
                <Button.View
                    href={resolveUnknownLink(primary_link) || ''}
                    isInverted={is_inverted}
                >
                    <Button.Label>{primary_label}</Button.Label>
                </Button.View>
            )}
            secondaryAction={(isInverted) => (
                <Button.View
                    href={resolveUnknownLink(secondary_link) || ''}
                    isInverted={isInverted}
                >
                    <Button.Label>{secondary_label}</Button.Label>
                </Button.View>
            )}
        />
    );
};

export default ArticleSlice;
