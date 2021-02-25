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
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { HeaderMenuProps } from '@blateral/b.kit/lib/components/sections/header/Header';

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

    settingsPage?: PrismicSettingsPage;
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
    primary: { badge, badge_on_mobile, title, is_nav_large, size },
    items,
    settingsPage,
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
            menu={createMenu({
                settingsData,
                mapSocials,
                is_inverted: settingsData?.header_is_inverted || false,
                nav_inverted: settingsData?.nav_is_inverted || false,
                is_nav_large,
                injectLogo,
                nav_primaryCtaFn:
                    nav_primaryAction && hasPrimaryNavButtonData(settingsData)
                        ? (isInverted?: boolean) =>
                              nav_primaryAction({
                                  isInverted,
                                  label: getText(
                                      settingsData?.nav_primary_label
                                  ),
                                  href:
                                      resolveUnknownLink(
                                          settingsData?.nav_primary_link
                                      ) || '',
                                  isExternal: isPrismicLinkExternal(
                                      settingsData?.nav_primary_link
                                  ),
                              })
                        : undefined,
                nav_secondaryCtaFn:
                    nav_secondaryAction &&
                    hasSecondaryNavButtonData(settingsData)
                        ? (isInverted?: boolean) =>
                              nav_secondaryAction({
                                  isInverted,
                                  label: getText(
                                      settingsData?.nav_secondary_label
                                  ),
                                  href:
                                      resolveUnknownLink(
                                          settingsData?.nav_secondary_link
                                      ) || '',
                                  isExternal: isPrismicLinkExternal(
                                      settingsData?.nav_secondary_link
                                  ),
                              })
                        : undefined,
            })}
            primaryCta={
                primaryAction && hasPrimaryButtonData(settingsData)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(
                                  settingsData?.header_primary_label
                              ),
                              href:
                                  resolveUnknownLink(
                                      settingsData?.header_primary_link
                                  ) || '',
                              isExternal: isPrismicLinkExternal(
                                  settingsData?.header_primary_link
                              ),
                          })
                    : undefined
            }
            secondaryCta={
                secondaryAction && hasSecondaryButtonData(settingsData)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(
                                  settingsData?.header_secondary_label
                              ),
                              href:
                                  resolveUnknownLink(
                                      settingsData?.header_secondary_link
                                  ) || '',
                              isExternal: isPrismicLinkExternal(
                                  settingsData?.header_secondary_link
                              ),
                          })
                    : undefined
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
    is_inverted?: boolean;
    nav_inverted?: boolean;
    nav_primaryCtaFn?: (isInverted?: boolean) => React.ReactNode;
    nav_secondaryCtaFn?: (isInverted?: boolean) => React.ReactNode;
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
    is_nav_large?: boolean;
}

const createMenu = ({
    settingsData,
    is_inverted,
    nav_inverted,
    nav_primaryCtaFn,
    nav_secondaryCtaFn,
    mapSocials,
    injectLogo,
}: MenuSliceType): HeaderMenuProps => {
    // return logo from prismic
    const logoFull = settingsData?.logo_image_full;
    const logoSmall = settingsData?.logo_image_small;
    const logoFullInverted = settingsData?.logo_image_full_inverted;
    const logoSmallInverted = settingsData?.logo_image_small_inverted;

    return {
        isLarge: settingsData?.nav_size || false,
        isTopInverted: is_inverted,
        isNavInverted: nav_inverted,
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

        primaryCta:
            (settingsData?.header_primary_label &&
                settingsData.header_primary_link?.url &&
                nav_primaryCtaFn) ||
            undefined,
        secondaryCta:
            (settingsData?.header_secondary_label &&
                settingsData?.header_secondary_link?.url &&
                nav_secondaryCtaFn) ||
            undefined,
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
                        };
                    }),
            };
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

const hasPrimaryButtonData = (settingsData: any) => {
    return !!(
        settingsData &&
        settingsData.header_primary_label &&
        settingsData.header_primary_link?.url
    );
};

const hasSecondaryButtonData = (settingsData: any) => {
    return !!(
        settingsData &&
        settingsData.header_secondary_label &&
        settingsData.header_secondary_link?.url
    );
};

const hasPrimaryNavButtonData = (settingsData: any) => {
    return !!(
        settingsData &&
        settingsData.nav_primary_label &&
        settingsData.nav_primary_link?.url
    );
};

const hasSecondaryNavButtonData = (settingsData: any) => {
    return !!(
        settingsData &&
        settingsData.nav_secondary_label &&
        settingsData.nav_secondary_link?.url
    );
};
