import { QuickNav } from '@blateral/b.kit';
import React from 'react';
import {
    PrismicKeyText,
    PrismicLink,
    PrismicRelationship,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

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
