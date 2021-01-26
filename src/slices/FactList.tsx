import {
    PrismicBoolean,
    PrismicHeading,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
} from '../utils/prismic';

// import { FactList } from '@blateral/b.kit';
import React from 'react';

interface FactListEntries {
    icon?: PrismicSelectField;
    title?: PrismicHeading;
    text?: PrismicRichText;
}

export interface ArticleSliceType
    extends PrismicSlice<'Article', FactListEntries> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink | string;
        secondary_link?: PrismicLink | string;
        primary_label?: string;
        secondary_label?: string;
    };
    // helpers to define component elements outside of slice
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
    secondaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
}

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary,
    // primary: {
    //     super_title,
    //     title,
    //     is_inverted,
    //     primary_link,
    //     primary_label,
    //     secondary_link,
    //     secondary_label,
    // },
    // primaryAction,
    // secondaryAction,
}) => {
    return (
        // <FactList />
        <span>FactList Komponente noch nicht vorhanden</span>
    );
};
