import {
    getHtmlText,
    getText,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicImage,
    PrismicKeyText,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
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
        bg_mode?: PrismicSelectField;
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
    primary: { bg_mode },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <FactList
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
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
        />
    );
};
