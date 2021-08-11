import React from 'react';
import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isRichTextEmpty,
    isValidAction,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicGeopoint,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';
import {
    FlyToIcon,
    MailIcon,
    Map,
    PhoneIcon,
    RouteIcon,
} from '@blateral/b.kit/lib';
import { AliasSelectMapperType } from 'utils/mapping';

interface MapLocationItems {
    super_title?: PrismicHeading;
    title?: PrismicRichText;
    position?: PrismicGeopoint;
    marker?: PrismicImage;

    phone?: PrismicRichText;
    mail?: PrismicRichText;
    route?: PrismicRichText;

    primary_link?: PrismicLink;
    primary_label?: PrismicKeyText;
    secondary_link?: PrismicLink;
    secondary_label?: PrismicKeyText;
}

type BgMode = 'full' | 'inverted';

export interface MapSliceType extends PrismicSlice<'Map', MapLocationItems> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        is_mirrored?: PrismicBoolean;
        with_fly_to?: PrismicBoolean;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    center?: [number, number];
    zoom?: number;
    flyToZoom?: number;
    /** Show all markers on first load */
    allMarkersOnInit?: boolean;
    /** Map container padding for show all markers */
    fitBoundsPadding?: [number, number];
    iconSettings: {
        size: [number, number];
        anchor: [number, number];
        sizeActive: [number, number];
        anchorActive: [number, number];
    };
    flyToControl?: React.ReactNode;
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
    controlNext?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        index?: number;
    }) => React.ReactNode;
    phoneIcon?: (isInverted?: boolean) => React.ReactNode;
    mailIcon?: (isInverted?: boolean) => React.ReactNode;
    routingIcon?: (isInverted?: boolean) => React.ReactNode;
}

export const MapSlice: React.FC<MapSliceType> = ({
    primary: { bg_mode, is_mirrored, with_fly_to },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    iconSettings,
    center,
    zoom,
    flyToZoom,
    flyToControl,
    fitBoundsPadding,
    allMarkersOnInit,
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    phoneIcon,
    mailIcon,
    routingIcon,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Map
            bgMode={bgMode === 'inverted' ? 'inverted' : 'full'}
            isMirrored={is_mirrored}
            initialLocation={items?.length > 0 ? `location-0` : undefined}
            center={center}
            zoom={zoom}
            flyToZoom={flyToZoom || 12}
            flyToControl={
                with_fly_to ? flyToControl || <FlyToIcon /> : undefined
            }
            allMarkersOnInit={allMarkersOnInit}
            fitBoundsPadding={fitBoundsPadding || [30, 30]}
            locations={items?.map((location, i) => {
                const posLat = location.position?.latitude || 0;
                const posLng = location.position?.longitude || 0;

                const contactInfo: {
                    label: string;
                    icon: React.ReactNode;
                }[] = [];
                if (location.phone && !isRichTextEmpty(location.phone)) {
                    contactInfo.push({
                        icon: phoneIcon || <PhoneIcon />,
                        label: getHtmlText(location?.phone),
                    });
                }
                if (location.mail && !isRichTextEmpty(location.mail)) {
                    contactInfo.push({
                        icon: mailIcon || <MailIcon />,
                        label: getHtmlText(location?.mail),
                    });
                }
                if (location.route && !isRichTextEmpty(location.route)) {
                    contactInfo.push({
                        icon: routingIcon || <RouteIcon />,
                        label: getHtmlText(location?.route),
                    });
                }

                return {
                    id: `location-${i}`,
                    position: [posLat, posLng],
                    meta: {
                        title: getHtmlText(location.title),
                        titleAs: 'span',
                        superTitle: getText(location.super_title),
                        superTitleAs: getHeadlineTag(location.super_title),
                        primaryAction:
                            primaryAction &&
                            isValidAction(
                                location.primary_label,
                                location.primary_link
                            )
                                ? (isInverted?: boolean) =>
                                      primaryAction({
                                          isInverted,
                                          label: getText(
                                              location.primary_label
                                          ),
                                          href:
                                              resolveUnknownLink(
                                                  location.primary_link
                                              ) || '',
                                          isExternal: isPrismicLinkExternal(
                                              location.primary_link
                                          ),
                                      })
                                : undefined,
                        secondaryAction:
                            secondaryAction &&
                            isValidAction(
                                location.secondary_label,
                                location.secondary_link
                            )
                                ? (isInverted?: boolean) =>
                                      secondaryAction({
                                          isInverted,
                                          label: getText(
                                              location.secondary_label
                                          ),
                                          href:
                                              resolveUnknownLink(
                                                  location.secondary_link
                                              ) || '',
                                          isExternal: isPrismicLinkExternal(
                                              location.secondary_link
                                          ),
                                      })
                                : undefined,

                        contact: contactInfo,
                    },
                    icon: {
                        size: iconSettings?.size || [20, 28],
                        anchor: iconSettings?.anchor || [10, 28],
                        sizeActive: iconSettings?.sizeActive || [50, 70],
                        anchorActive: iconSettings?.anchorActive || [25, 70],
                        url: location.marker?.url || '',
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
            dot={dot}
        />
    );
};
