import { QuickNav } from '@blateral/b.kit';
import {
    PrismicLink,
    PrismicKeyText,
    PrismicSlice,
    resolveUnknownLink,
} from 'index';
import React from 'react';
import { PrismicRelationship } from 'utils/prismic';

interface QuickNavItem {
    link: PrismicLink;
    label: PrismicKeyText;
}

export interface QuickNavSliceType
    extends PrismicSlice<'QuickNav', QuickNavItem> {
    primary: {
        active_link?: string;
        quicknav_data?: PrismicRelationship;
    };
}
export const QuickNavSlice: React.FC<QuickNavSliceType> = ({
    primary: { active_link },
    items,
}) => {
    console.log('ITEMS', items);
    return (
        <QuickNav
            navItems={items?.map((item) => {
                return {
                    link: resolveUnknownLink(item.link) || '',
                    label: item.label || '',
                };
            })}
            activeNavItem={active_link || ''}
        />
    );
};
