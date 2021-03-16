import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicSelectField,
    PrismicSettingsPage,
    PrismicSlice,
    getText,
    isPrismicLinkExternal,
    resolveUnknownLink,
    mapPrismicSelect,
    getPrismicImage as getImg,
    getImageFromUrls,
    PrismicSettingsData,
    getHeadlineTag,
    isPrismicLinkEmpty,
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { HeaderNavProps } from '@blateral/b.kit/lib/components/sections/header/Header';
import {
    NavGroup,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/header/menu/Flyout';

interface HeaderImageItem {
    image?: PrismicImage;
}

type HeaderSize = 'full' | 'small';

interface ImageFormats {
    portrait: string;
    landscape: string;
}

export interface HeaderSliceType
    extends PrismicSlice<'Header', HeaderImageItem> {
    primary: {
        is_active?: PrismicBoolean;
        primary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_label?: PrismicKeyText;
        secondary_link?: PrismicLink;
        badge?: PrismicImage;
        badge_on_mobile?: PrismicBoolean;
        title?: PrismicHeading;
        is_nav_large?: PrismicBoolean;

        nav_inverted?: PrismicBoolean;
        size?: PrismicSelectField;
        is_inverted?: PrismicBoolean;
    };

    // helpers to define component elements outside of slice
    sizeSelectAlias?: AliasSelectMapperType<HeaderSize>;
    imageFormatAlias?: AliasMapperType<ImageFormats>;
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
        size?: 'desktop' | 'mobile';
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    nav_secondaryAction?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    mapSocials?: (
        socials?: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
    ) => Array<{
        href: string;
        icon: JSX.Element;
    }>;

    // inject logo icon for into slice
    injectLogo?: (props: {
        isInverted?: boolean;
        size?: 'full' | 'small';
    }) => React.ReactNode;

    search?: (isInverted?: boolean) => React.ReactNode;

    settingsPage?: PrismicSettingsPage;
    pageUrl?: string;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 660, height: 792 },
        medium: { width: 1100, height: 1320 },
        large: { width: 1596, height: 860 },
        xlarge: { width: 2450, height: 1320 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    primary: {
        badge,
        badge_on_mobile,
        title,
        is_nav_large,
        size,
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
    },
    items,
    settingsPage,
    pageUrl,
    sizeSelectAlias = {
        full: 'full',
        small: 'small',
    },
    imageFormatAlias = {
        portrait: 'portrait',
        landscape: 'landscape',
    },
    primaryAction,
    secondaryAction,
    nav_primaryAction,
    nav_secondaryAction,
    mapSocials,
    injectLogo,
    search,
}) => {
    const settingsData = settingsPage?.data;

    // map header images
    const headerImageMap = items.map((item) => {
        // get image format url for landscape
        const imgUrlPortrait =
            item.image && getImg(item.image, imageFormatAlias.portrait).url;

        // get image format url for landscape
        const imgUrlLandscape =
            item.image && getImg(item.image, imageFormatAlias.landscape).url;

        return {
            ...getImageFromUrls(
                {
                    small: imgUrlPortrait || '',
                    medium: imgUrlPortrait,
                    large: imgUrlLandscape,
                    xlarge: imgUrlLandscape,
                },
                imageSizes.main,
                getText(item?.image?.alt)
            ),
        };
    });

    return (
        <Header
            size={mapPrismicSelect<HeaderSize>(sizeSelectAlias, size) || 'full'}
            images={headerImageMap}
            titleAs={getHeadlineTag(title)}
            title={getText(title)}
            badge={headerBadge(badge, badge_on_mobile)}
            navigation={createMenu({
                settingsData,
                pageUrl,
                mapSocials,
                is_inverted: settingsData?.header_is_inverted || false,
                nav_inverted: settingsData?.nav_is_inverted || false,
                is_nav_large,
                injectLogo,
                search,
                nav_primaryCtaFn: ({ isInverted, size }) =>
                    nav_primaryAction &&
                    nav_primaryAction({
                        isInverted,
                        size,
                        label: getText(settingsData?.header_primary_label),
                        href:
                            resolveUnknownLink(
                                settingsData?.header_primary_link
                            ) || '',
                        isExternal: isPrismicLinkExternal(
                            settingsData?.header_primary_link
                        ),
                    }),
                nav_secondaryCtaFn: ({ isInverted, size }) =>
                    nav_secondaryAction &&
                    nav_secondaryAction({
                        isInverted,
                        size,
                        label: getText(settingsData?.header_secondary_label),
                        href:
                            resolveUnknownLink(
                                settingsData?.header_secondary_link
                            ) || '',
                        isExternal: isPrismicLinkExternal(
                            settingsData?.header_secondary_link
                        ),
                    }),
            })}
            primaryCta={(isInverted: boolean) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryCta={(isInverted: boolean) =>
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

function headerBadge(badge?: PrismicImage, showOnMobile = true) {
    return badge && badge.url
        ? {
              content: (
                  <img
                      src={badge?.url || ''}
                      alt={badge?.alt || ''}
                      style={{ height: '100%', width: '100%' }}
                  />
              ),
              showOnMobile: showOnMobile,
          }
        : undefined;
}

interface MenuSliceType {
    settingsData?: PrismicSettingsData;
    pageUrl?: string;
    is_inverted?: boolean;
    nav_inverted?: boolean;
    nav_primaryCtaFn?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
    }) => React.ReactNode;
    nav_secondaryCtaFn?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
    }) => React.ReactNode;
    mapSocials?: (
        socials?: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
    ) => Array<{
        href: string;
        icon: JSX.Element;
    }>;
    // inject logo icon into slice
    injectLogo?: (props: {
        isInverted?: boolean;
        size?: 'full' | 'small';
    }) => React.ReactNode;

    // inject search into slice
    search?: (isInverted?: boolean) => React.ReactNode;

    is_nav_large?: boolean;
}

const createMenu = ({
    settingsData,
    pageUrl,
    is_inverted,
    nav_inverted,
    nav_primaryCtaFn,
    nav_secondaryCtaFn,
    mapSocials,
    injectLogo,
    search,
}: MenuSliceType): HeaderNavProps => {
    // return logo from prismic
    const logoFull = settingsData?.logo_image_full;
    const logoSmall = settingsData?.logo_image_small;
    const logoFullInverted = settingsData?.logo_image_full_inverted;
    const logoSmallInverted = settingsData?.logo_image_small_inverted;

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

    return {
        isLargeMenu: settingsData?.nav_size || false,
        isTopbarInverted: is_inverted,
        isMenuInverted: nav_inverted,
        logo: {
            link: resolveUnknownLink(settingsData?.logo_href) || '',
            icon: injectLogo
                ? injectLogo
                : ({ isInverted, size }) =>
                      logoFn({
                          isInverted: isInverted || false,
                          size: size || 'full',
                          imgUrlSmall: logoSmall?.url || '',
                          imgUrlSmallInverted: logoSmallInverted?.url || '',
                          imgUrlFull: logoFull?.url || '',
                          imgUrlFullInverted: logoFullInverted?.url || '',
                      }),
        },
        socials: mapSocials && mapSocials(settingsData?.socials),
        search: search && search,
        primaryCta:
            (settingsData?.header_primary_label &&
                !isPrismicLinkEmpty(settingsData.header_primary_link) &&
                nav_primaryCtaFn) ||
            undefined,
        secondaryCta:
            (settingsData?.header_secondary_label &&
                !isPrismicLinkEmpty(settingsData?.header_secondary_link) &&
                nav_secondaryCtaFn) ||
            undefined,
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

const logoFn = ({
    isInverted,
    size,
    imgUrlSmall,
    imgUrlSmallInverted,
    imgUrlFull,
    imgUrlFullInverted,
}: {
    isInverted: boolean;
    size: 'full' | 'small';
    imgUrlSmall: string;
    imgUrlSmallInverted: string;
    imgUrlFull: string;
    imgUrlFullInverted: string;
}) => {
    const url = size === 'full' ? imgUrlFull : imgUrlSmall;
    const invertedUrl =
        size === 'full' ? imgUrlFullInverted : imgUrlSmallInverted;

    return <img src={isInverted ? invertedUrl : url} />;
};
