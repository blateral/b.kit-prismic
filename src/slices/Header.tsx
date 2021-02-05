import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicSelectField,
    PrismicSettingsPage,
    PrismicSlice,
    getHtmlElementFromPrismicType,
    getText,
    isPrismicLinkExternal,
    resolveUnknownLink,
    mapPrismicSelect,
    getPrismicImage as getImg,
    getImageFromUrls,
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
import React from 'react';
import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

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

    iconFunction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    mapSocials?: (
        socials: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
    ) => Array<{
        href: string;
        icon: JSX.Element;
    }>;

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
    primary: {
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
        badge,
        title,
        is_nav_large,
        is_inverted,
        nav_inverted,
        size,
    },
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
    iconFunction,
    mapSocials,
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
            titleAs={title && getHtmlElementFromPrismicType(title[0] as any)}
            title={getText(title)}
            badge={headerBadge(badge)}
            menu={createMenu({
                settingsData,
                mapSocials,
                iconFunction,
                is_inverted,
                nav_inverted,
                is_nav_large,
                nav_primaryCtaFn: (isInverted?: boolean) =>
                    nav_primaryAction &&
                    nav_primaryAction({
                        isInverted,
                        label: getText(settingsData?.nav_primary_label),
                        href:
                            resolveUnknownLink(
                                settingsData?.nav_primary_link
                            ) || '',
                        isExternal: isPrismicLinkExternal(
                            settingsData?.nav_primary_link
                        ),
                    }),
                nav_secondaryCtaFn: (isInverted?: boolean) =>
                    nav_secondaryAction &&
                    nav_secondaryAction({
                        isInverted,
                        label: getText(settingsData?.nav_secondary_label),
                        href:
                            resolveUnknownLink(
                                settingsData?.nav_secondary_link
                            ) || '',
                        isExternal: isPrismicLinkExternal(
                            settingsData?.nav_secondary_link
                        ),
                    }),
            })}
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

function createMenu({
    settingsData,
    iconFunction,
    is_inverted,
    nav_inverted,
    nav_primaryCtaFn,
    nav_secondaryCtaFn,
    mapSocials,
    is_nav_large,
}: any) {
    return {
        isLarge: is_nav_large,
        isTopInverted: is_inverted,
        isNavInverted: nav_inverted,
        logo: {
            link: resolveUnknownLink(settingsData.logo_href) || '',
            icon: iconFunction,
        },
        socials: mapSocials && mapSocials(settingsData.socials),

        primaryCta: nav_primaryCtaFn,
        secondaryCta: nav_secondaryCtaFn,
        navItems: settingsData.main_nav.map((navItem: any, index: number) => {
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
