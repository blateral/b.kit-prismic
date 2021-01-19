import React from 'react';

import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    linkResolver,
    PrismicLink,
    resolveUnknownLink,
    PrismicImage,
    AliasMapperType,
} from '../utils/prismic';

import { RichText } from 'prismic-dom';
import { FeatureList } from '@blateral/b.kit';

type Sizes = 'half' | 'full';

export interface FeatureListSliceType extends PrismicSlice<'FeatureList'> {
    primary: {
        title?: PrismicHeading;
        super_title?: PrismicRichText;
        text?: PrismicRichText;

        is_inverted?: PrismicBoolean;
        bg_mode?: 'full' | 'splitted';

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
    items: {
        title?: PrismicHeading;
        text?: PrismicRichText;

        description?: PrismicRichText;
        intro?: PrismicRichText;
        image: PrismicImage & {
            medium: PrismicImage;
            semilarge: PrismicImage;
            large: PrismicImage;
            xlarge: PrismicImage;
        };

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    }[];

    // helpers to define elements outside of slice
    sizeSelectAlias?: AliasMapperType<Sizes>;
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string
    ) => React.ReactNode;
    secondaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string
    ) => React.ReactNode;
}

const FeatureListSlice: React.FC<FeatureListSliceType> = ({
    primary: {
        title,
        super_title,
        text,
        is_inverted,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    return (
        <FeatureList
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    RichText.asText(primary_label),
                    resolveUnknownLink(primary_link) || ''
                )
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    RichText.asText(secondary_label),
                    resolveUnknownLink(secondary_link) || ''
                )
            }
            isInverted={is_inverted}
            features={items.map(
                ({
                    title,
                    text,
                    description,
                    intro,
                    image,
                    primary_label,
                    primary_link,
                    secondary_label,
                    secondary_link,
                }) => {
                    return {
                        title: RichText.asText(title),
                        text: RichText.asHtml(text),
                        description: RichText.asHtml(description),
                        intro: RichText.asHtml(intro),

                        image: {
                            small: image?.url || '',
                            medium: image?.Medium?.url || '',
                            large: image?.Large?.url || '',
                            xlarge: image?.ExtraLarge?.url || '',
                            alt: image?.alt && RichText.asText(image.alt),
                        },

                        primaryAction: (isInverted) =>
                            primaryAction &&
                            primaryAction(
                                isInverted,
                                RichText.asText(primary_label),
                                resolveUnknownLink(primary_link) || ''
                            ),
                        secondaryAction: (isInverted) =>
                            secondaryAction &&
                            secondaryAction(
                                isInverted,
                                RichText.asText(secondary_label),
                                resolveUnknownLink(secondary_link) || ''
                            ),
                    };
                }
            )}
        />
    );
};

export default FeatureListSlice;
