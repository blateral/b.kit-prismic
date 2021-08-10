import {
    getText,
    isPrismicLinkExternal,
    isValidAction,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

import { IconList } from '@blateral/b.kit';
import React from 'react';
import { AliasSelectMapperType } from 'utils/mapping';

interface IconListImages {
    image: PrismicImage;
}

type BgMode = 'full' | 'inverted';

export interface IconListSliceType
    extends PrismicSlice<'IconList', IconListImages> {
    primary: {
        is_active?: PrismicBoolean;

        is_centered?: PrismicBoolean;
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

export const IconListSlice: React.FC<IconListSliceType> = ({
    primary: {
        bg_mode,
        is_centered,
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
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <IconList
            isCentered={is_centered}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            items={items.map((item) => {
                return {
                    src: item?.image?.url || '',
                    alt: item?.image?.alt || '',
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
