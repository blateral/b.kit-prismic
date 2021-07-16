import {
    LogoProps,
    NavProps,
} from '@blateral/b.kit/lib/components/sections/navigation/Navigation';
import {
    NavGroup,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/navigation/menu/Flyout';
import {
    isPrismicLinkEmpty,
    PrismicKeyText,
    PrismicLink,
    PrismicSettingsData,
    PrismicSettingsPage,
    resolveUnknownLink,
} from 'utils/prismic';

import { Navigation } from '@blateral/b.kit';
import React from 'react';

// export interface NavigationSliceType {
//     nav_primaryAction?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     nav_secondaryAction?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
// }

export interface NavigationProps {
    pageUrl?: string;

    isLargeMenu?: boolean; // Global Settings
    isMenuInverted?: boolean; // Global Settings
    isTopbarInverted?: boolean; // Global Settings
    hideTopbarBackUnderMenu?: boolean; // Not Prismic
    isTopbarLargeOnPageTop?: boolean; // Not Prismic
    backdropOpacity?: number; // Not Prismic
    allowTopbarOverflow?: boolean; // Page Settings

    activeNavItem?: string;
    navItems?: NavGroup[];
    socialMapper?: (
        socials?:
            | {
                  platform?: PrismicKeyText | undefined;
                  link?: PrismicLink | undefined;
              }[]
            | undefined,
        id?: string | undefined
    ) => {
        href: string;
        icon: JSX.Element;
    }[];
    logo?: LogoProps;

    primaryCta?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        name?: string;
    }) => React.ReactNode;
    secondaryCta?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        name?: string;
    }) => React.ReactNode;
    search?: (isInverted?: boolean) => React.ReactNode;
    openMenuIcon?: (isInverted?: boolean) => React.ReactNode;
    closeMenuIcon?: (isInverted?: boolean) => React.ReactNode;
}

export const NavigationSlice: React.FC<
    NavigationProps & { pageUrl?: string; settingsPage?: PrismicSettingsPage }
> = ({
    pageUrl,
    socialMapper,
    settingsPage,
    logo,
    primaryCta,
    secondaryCta,
    allowTopbarOverflow,
    isTopbarLargeOnPageTop,
    ...rest
}) => {
    const data = settingsPage?.data;
    const menu = createMenu({
        pageUrl,
        socials: socialMapper && socialMapper(data?.socials),
        menu_islargemenu: data?.menu_islargemenu,

        settingsData: data,
        menu_ismenuinverted: data?.menu_ismenuinverted,
        tb_istopbarinverted: data?.tb_istopbarinverted,
        nav_primaryCtaFn: primaryCta,
        nav_secondaryCtaFn: secondaryCta,
        logo,
    });
    return (
        <Navigation
            {...menu}
            allowTopbarOverflow={allowTopbarOverflow}
            isTopbarLargeOnPageTop={isTopbarLargeOnPageTop}
            {...rest}
        />
    );
};

interface MenuSliceType {
    settingsData?: PrismicSettingsData;
    pageUrl?: string;
    menu_islargemenu?: boolean;
    menu_ismenuinverted?: boolean;
    tb_istopbarinverted?: boolean;
    nav_primaryCtaFn?: (props: {
        isInverted?: boolean | undefined;
        label?: string | undefined;
        href?: string | undefined;
        isExternal?: boolean | undefined;
    }) => React.ReactNode;
    nav_secondaryCtaFn?: (props: {
        isInverted?: boolean | undefined;
        label?: string | undefined;
        href?: string | undefined;
        isExternal?: boolean | undefined;
    }) => React.ReactNode;
    socials?: Array<{
        icon: React.ReactNode;
        href: string;
    }>;
    // inject logo icon into slice
    logo?: LogoProps;

    // inject search into slice
    search?: (isInverted?: boolean) => React.ReactNode;
}
const createMenu = ({
    settingsData,
    pageUrl,
    menu_islargemenu,
    menu_ismenuinverted,
    tb_istopbarinverted,

    nav_primaryCtaFn,
    nav_secondaryCtaFn,
    socials,
    logo,
    search,
}: MenuSliceType): NavProps => {
    // return logo from prismic
    // const logoFull = settingsData?.logo_image_full;
    // const logoSmall = settingsData?.logo_image_small;
    // const logoFullInverted = settingsData?.logo_image_full_inverted;
    // const logoSmallInverted = settingsData?.logo_image_small_inverted;

    const activeItemIndexes = {
        groupId: '',
        itemId: '',
    };
    settingsData?.main_nav?.every((navGroup, groupIndex) => {
        const navItems = navGroup?.items;
        let hasFound = false;

        navItems?.every((navItem, itemIndex) => {
            const itemLink =
                (navItem.link && resolveUnknownLink(navItem.link)) || '';

            // try to get page URL
            let pageUrlString = pageUrl;
            try {
                pageUrlString = new URL(pageUrl || '').pathname;
            } catch (err) {
                // console.log(err);
            }

            if (itemLink === pageUrlString) {
                activeItemIndexes.groupId = groupIndex.toString();
                activeItemIndexes.itemId = itemIndex.toString();
                hasFound = true;
                return false;
            } else return true;
        });
        if (hasFound) return false;
        else return true;
    });

    const logoLinkParsed = resolveUnknownLink(settingsData?.logo_href);
    const logoLinkCleaned =
        logoLinkParsed && /index/.test(logoLinkParsed)
            ? logoLinkParsed.replace('index', '')
            : logoLinkParsed
            ? logoLinkParsed
            : '';
    return {
        isLargeMenu: menu_islargemenu || false,
        isTopbarInverted: tb_istopbarinverted,
        isMenuInverted: menu_ismenuinverted,
        logo: {
            icon: logo && logo.icon,
            link: logoLinkCleaned,
            pageTopScale: logo && logo.pageTopScale,
        },
        socials: socials,
        search: search && search,
        primaryCta: ({ isInverted, size }) =>
            nav_primaryCtaFn &&
            !isPrismicLinkEmpty(settingsData?.header_primary_link) &&
            settingsData?.header_primary_label
                ? nav_primaryCtaFn({
                      isInverted,
                      href:
                          resolveUnknownLink(
                              settingsData?.header_primary_link
                          ) || '',
                      label:
                          (size === 'desktop' ||
                          !settingsData?.header_primary_label_short
                              ? settingsData?.header_primary_label
                              : settingsData?.header_primary_label_short) || '',
                  })
                : undefined,
        secondaryCta: ({ isInverted, size }) =>
            nav_secondaryCtaFn &&
            !isPrismicLinkEmpty(settingsData?.header_secondary_link) &&
            settingsData?.header_secondary_label
                ? nav_secondaryCtaFn({
                      isInverted,
                      href:
                          resolveUnknownLink(
                              settingsData?.header_secondary_link
                          ) || '',
                      label:
                          (size === 'desktop' ||
                          !settingsData?.header_secondary_label_short
                              ? settingsData?.header_secondary_label
                              : settingsData?.header_secondary_label_short) ||
                          '',
                  })
                : undefined,

        activeNavItem: `navGroup${activeItemIndexes.groupId}.nav-link${activeItemIndexes.itemId}`,
        navItems: settingsData?.main_nav?.map((navItem: any, index: number) => {
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
                        } as NavItem;
                    }),
            } as NavGroup;
        }),
    };
};

// const logoFn = ({
//     isInverted,
//     size,
//     imgUrlSmall,
//     imgUrlSmallInverted,
//     imgUrlFull,
//     imgUrlFullInverted,
// }: {
//     isInverted: boolean;
//     size: 'full' | 'small';
//     imgUrlSmall: string;
//     imgUrlSmallInverted: string;
//     imgUrlFull: string;
//     imgUrlFullInverted: string;
// }) => {
//     const url = size === 'full' ? imgUrlFull : imgUrlSmall;
//     const invertedUrl =
//         size === 'full' ? imgUrlFullInverted : imgUrlSmallInverted;

//     return <img src={isInverted ? invertedUrl : url} />;
// };
