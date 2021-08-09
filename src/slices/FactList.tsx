import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isValidAction,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactList } from '@blateral/b.kit';
import { AliasSelectMapperType } from 'utils/mapping';

interface FactListEntryItems {
    label?: PrismicKeyText;
    text?: PrismicRichText;
    icon?: PrismicImage;
}

type BgMode = 'full' | 'inverted';

export interface FactListSliceType
    extends PrismicSlice<'FactList', FactListEntryItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicRichText;
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

export const FactListSlice: React.FC<FactListSliceType> = ({
    primary: {
        super_title,
        title,
        intro,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <FactList
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
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
