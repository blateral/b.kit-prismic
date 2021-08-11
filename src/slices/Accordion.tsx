import { Accordion } from '@blateral/b.kit';
import React from 'react';
import { AliasSelectMapperType } from 'utils/mapping';
import {
    mapPrismicSelect,
    PrismicBoolean,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    getText,
    PrismicKeyText,
    getHtmlText,
} from 'utils/prismic';

type BgMode = 'full' | 'inverted';

export interface AccordionSliceType extends PrismicSlice<'Accordion'> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
    };
    items: {
        label: PrismicKeyText;
        text?: PrismicRichText;
        has_columns?: PrismicBoolean;
    }[];
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    primary: { bg_mode },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Accordion
            items={items.map((item) => {
                return {
                    label: getText(item.label),
                    text: getHtmlText(item.text),
                    hasColumns: item.has_columns,
                };
            })}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
        />
    );
};
