import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isValidAction,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React, { useContext } from 'react';
import { FactList } from '@blateral/b.kit';
import { PrismicContext } from 'utils/settings';

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
    const settingsCtx = useContext(PrismicContext);

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
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href:
                                  resolveUnknownLink(
                                      primary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
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
                              href:
                                  resolveUnknownLink(
                                      secondary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
