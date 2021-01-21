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
    PrismicSelectField,
    mapPrismicSelect,
    isPrismicLinkExternal,
} from 'utils/prismic';
import { RichText } from 'prismic-dom';
import { FeatureList } from '@blateral/b.kit';

type BgMode = 'full' | 'splitted';

export interface FeatureListSliceType extends PrismicSlice<'feature_list'> {
    primary: {
        title?: PrismicHeading;
        super_title?: PrismicRichText;
        text?: PrismicRichText;

        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;

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
        image: PrismicImage;

        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    }[];

    // helpers to define elements outside of slice
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
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <FeatureList
            isInverted={is_inverted}
            bgMode={mapPrismicSelect(bgModeSelectAlias, bg_mode)}
            title={RichText.asText(title)}
            superTitle={RichText.asText(super_title)}
            text={RichText.asHtml(text, linkResolver)}
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
                        description: RichText.asHtml(description, linkResolver),
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
                                resolveUnknownLink(primary_link) || '',
                                isPrismicLinkExternal(primary_link)
                            ),
                        secondaryAction: (isInverted) =>
                            secondaryAction &&
                            secondaryAction(
                                isInverted,
                                RichText.asText(secondary_label),
                                resolveUnknownLink(secondary_link) || '',
                                isPrismicLinkExternal(secondary_link)
                            ),
                    };
                }
            )}
        />
    );
};

export default FeatureListSlice;
