import {
    PrismicGeopoint,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
} from '../utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React from 'react';

interface MapLocationItems {
    location?: PrismicGeopoint;
    name?: PrismicHeading;
    contact?: PrismicRichText;
}

export interface MapSliceType extends PrismicSlice<'Map', MapLocationItems> {
    primary: {
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        primary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
}

export const MapSlice: React.FC<MapSliceType> = ({
    primary: { super_title, title, text, primary_link, primary_label },
    items,
    primaryAction,
    // secondaryAction,
}) => {
    return (
        // <FactList />
        <span>Map Komponente noch nicht vorhanden</span>
    );
};
