import { Accordion } from '@blateral/b.kit';
import { ColorType } from '@blateral/b.kit/lib/utils/styles';
import React from 'react';
import { AliasSelectMapperType } from 'utils/mapping';
import {
    mapPrismicSelect,
    PrismicBoolean,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    getText,
} from 'utils/prismic';

type BgMode = 'full' | 'inverted';

export interface AccordionSliceType extends PrismicSlice<'Accordion'> {
    primary: {
        border_color?: ColorType;
        bg_mode?: PrismicSelectField;
    };
    items: {
        label: PrismicRichText;
        text?: PrismicRichText;
        has_columns?: PrismicBoolean;
    }[];
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    primary: { border_color, bg_mode },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    return (
        <Accordion
            borderColor={border_color}
            items={items.map((item) => {
                return {
                    label: getText(item.label),
                    text: getText(item.text),
                    hasColumns: item.has_columns,
                };
            })}
            bgMode={bgMode}
        />
    );
};
