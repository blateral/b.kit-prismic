import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactList } from '@blateral/b.kit';

interface FactListEntryItems {
    label?: PrismicKeyText;
    text?: PrismicRichText;
    icon?: PrismicImage;
}

export interface FactListSliceType
    extends PrismicSlice<'FactList', FactListEntryItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        has_back?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
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

export const FactListSlice: React.FC<FactListSliceType> = ({
    primary: {
        super_title,
        title,
        intro,
        is_inverted,
        has_back,
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
        <FactList
            isInverted={is_inverted}
            hasBack={has_back}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            intro={getHtmlText(intro)}
            facts={items.map((item) => {
                return {
                    label: getText(item.label),
                    text: getHtmlText(item.text),
                    icon: {
                        src: item?.icon?.url || '',
                        alt: item?.icon?.alt || '',
                    },
                };
            })}
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
