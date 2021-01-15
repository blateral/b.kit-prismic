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
        primary_action?: { link?: PrismicLink | string; label?: string };
        secondary_action?: { link?: PrismicLink | string; label?: string };
    };
}

const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary: {
        suptitle,
        title,
        text,
        aside_text,
        is_inverted,
        primary_action,
        secondary_action,
    },
}) => {
    return (
        <Article
            title={RichText.asText(title)}
            superTitle={RichText.asText(suptitle)}
            text={RichText.asHtml(text, linkResolver)}
            asideText={RichText.asHtml(aside_text, linkResolver)}
            isInverted={is_inverted}
            primaryAction={(is_inverted) => (
                <Button.View
                    href={resolveUnknownLink(primary_action?.link) || ''}
                    isInverted={is_inverted}
                >
                    <Button.Label>{primary_action?.label}</Button.Label>
                </Button.View>
            )}
            secondaryAction={(isInverted) => (
                <Button.View
                    href={resolveUnknownLink(secondary_action?.link) || ''}
                    isInverted={isInverted}
                >
                    <Button.Label>{secondary_action?.label}</Button.Label>
                </Button.View>
            )}
        />
    );
};

export default ArticleSlice;
