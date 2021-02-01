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
import React from 'react';


interface HeaderImages {
    images?: PrismicImage;
}

export interface HeaderSliceType extends PrismicSlice<'Header', HeaderImages> {
    primary: {
        is_active?: PrismicBoolean;
        primary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_label?: PrismicKeyText;
        secondary_link?: PrismicLink;
        badge?: PrismicImage;
        title?: PrismicHeading;
        nav_inverted?: PrismicBoolean;
        size?: PrismicSelectField;
        is_inverted?: PrismicBoolean;
    };

    // helpers to define component elements outside of slice
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


    nav_primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    nav_secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    iconFunction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    settingsPage?: PrismicSettingsPage;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    primary: {
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
        badge,
        title,
        nav_inverted,
        size,
        is_inverted,
    },
    items,
    settingsPage,
    primaryAction,
    secondaryAction,
    iconFunction
}) => {
    const settings = settingsPage?.data;
    const headerImageMap = items.map((imageObj) => {
        return {
            small: imageObj?.images?.url || '',
            medium: imageObj?.images?.url || '',
            large: imageObj?.images?.url,
            semilarge: imageObj?.images?.url,
            xlarge: imageObj?.images?.url,
        };
    });

    return (
        <Header
            size={size ? (size === 'small' ? 'small' : 'full') : 'full'}
            images={headerImageMap}
            titleAs={title && getHtmlElementFromPrismicType(title[0] as any)}
            title={getText(title)}
            badge={headerBadge(badge)}
            menu={createMenu({ settings,iconFunction, is_inverted, nav_inverted })}
            primaryCta={(isInverted) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryCta={(isInverted) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: getText(secondary_label),
                    href: resolveUnknownLink(secondary_link) || '',
                    isExternal: isPrismicLinkExternal(secondary_link),
                })
            }
        />
    );
};

function headerBadge(badge?: PrismicImage, showOnMobile = false) {
    return {
        content: (
            <img
                src={badge?.url || ''}
                alt={badge?.alt || ''}
                style={{ height: '100%', width: '100%' }}
            />
        ),
        showOnMobile: showOnMobile,
    };
}

function createMenu({ settings, iconFunction, is_inverted, nav_inverted, size }: any) {
    console.log(settings);
    return {
        isTopInverted: is_inverted,
        isNavInverted: nav_inverted,
        logo: {
            link: resolveUnknownLink(settings.logo_href) || "",
            icon: iconFunction

        },
        socials: settings?.socials?.map((social: any) => {
            return {
                href: resolveUnknownLink(social.link) || '',
                icon: social.platform,
            };
        }),
        isLarge: size === 'full',

        navItems: settings.main_nav.map((navItem: any, index: number) => {
            return {
                id: `navGroup${index}`,
                name: navItem?.primary?.name || '',
                isSmall: navItem?.primary?.is_small,

                items:
                    navItem.items &&
                    navItem.items.map((item: any, subindex: number) => {
                        return {
                            id: `nav-link${subindex}`,
                            label: item?.label || '',
                            link: {
                                href: resolveUnknownLink(item.link) || '',
                            },
                            onClick: (id: string, fullId: string) =>
                                console.log(fullId),
                        };
                    }),
            };
        }),
  
    };
}
