import {
    getHtmlElementFromPrismicType,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicSelectField,
    PrismicSettingsPage,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';

export interface HeaderSliceType extends PrismicSlice<'Header', PrismicImage> {
    primary: {
        is_active?: PrismicBoolean;
        primary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_label?: PrismicKeyText;
        secondary_link?: PrismicLink;

        title?: PrismicHeading;
        nav_inverted?: PrismicBoolean;
        size?: PrismicSelectField;
        is_inverted?: PrismicBoolean;
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
    settingsPage?: PrismicSettingsPage;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    primary: {
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
        title,
        nav_inverted,
        size,
        is_inverted,
    },
    items,
    settingsPage,
    primaryAction,
    secondaryAction,
}) => {
    settingsPage;
    return (
        <Header
            size={size ? (size as 'small') || 'full' : 'full'}
            images={items.map((image) => {
                return { small: image.url || '' };
            })}
            titleAs={title && getHtmlElementFromPrismicType(title[0] as any)}
            title={getText(title)}
            
            primaryCta={(isInverted) =>
                primaryAction &&
                primaryAction(
                    isInverted,
                    getText(primary_label),
                    resolveUnknownLink(primary_link) || '',
                    isPrismicLinkExternal(primary_link)
                )
            }
            secondaryCta={(isInverted) =>
                secondaryAction &&
                secondaryAction(
                    isInverted,
                    getText(secondary_label),
                    resolveUnknownLink(secondary_link) || '',
                    isPrismicLinkExternal(secondary_link)
                )
            }
        />
    );
};
