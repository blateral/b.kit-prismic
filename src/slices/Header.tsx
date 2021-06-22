import {
    AliasMapperType,
    AliasSelectMapperType,
    ImageSizeSettings,
} from 'utils/mapping';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicSelectField,
    PrismicSettingsPage,
    PrismicSlice,
    getHeadlineTag,
    getImageFromUrls,
    getPrismicImage as getImg,
    getText,
    isPrismicLinkExternal,
    mapPrismicSelect,
    resolveUnknownLink,
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import React from 'react';

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
        video_url?: PrismicLink;
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
    customTopGradient?: string;
    customBottomGradient?: string;
    search?: (isInverted?: boolean) => React.ReactNode;

    settingsPage?: PrismicSettingsPage;
    pageUrl?: string;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 660, height: 792 },
        medium: { width: 1100, height: 1320 },
        semilarge: { width: 1100, height: 700 },
        large: { width: 1596, height: 860 },
        xlarge: { width: 2450, height: 1320 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    primary: {
        video_url,
        badge,
        badge_on_mobile,
        title,
        size,
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
    },
    items,
    customBottomGradient,
    customTopGradient,
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
}) => {
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
            videoUrl={resolveUnknownLink(video_url) || ''}
            images={headerImageMap}
            titleAs={getHeadlineTag(title)}
            title={getText(title)}
            badge={headerBadge(badge, badge_on_mobile)}
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
            customTopGradient={customTopGradient}
            customBottomGradient={customBottomGradient}
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

// interface MenuSliceType {
//     settingsData?: PrismicSettingsData;
//     pageUrl?: string;
//     is_inverted?: boolean;
//     nav_inverted?: boolean;
//     nav_primaryCtaFn?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//     }) => React.ReactNode;
//     nav_secondaryCtaFn?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//     }) => React.ReactNode;
//     mapSocials?: (
//         socials?: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
//     ) => Array<{
//         href: string;
//         icon: JSX.Element;
//     }>;
//     // inject logo icon into slice
//     injectLogo?: (props: {
//         isInverted?: boolean;
//         size?: 'full' | 'small';
//     }) => React.ReactNode;

//     // inject search into slice
//     search?: (isInverted?: boolean) => React.ReactNode;

//     is_nav_large?: boolean;
// }
