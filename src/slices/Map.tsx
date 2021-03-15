import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicGeopoint,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

import React from 'react';
import { FlyToIcon, Map } from '@blateral/b.kit/lib';

interface MapLocationItems {
    super_title?: PrismicHeading;
    title?: PrismicRichText;
    position?: PrismicGeopoint;
    marker?: PrismicImage;

    primary_link?: PrismicLink;
    primary_label?: PrismicKeyText;
    secondary_link?: PrismicLink;
    secondary_label?: PrismicKeyText;
}

export interface MapSliceType extends PrismicSlice<'Map', MapLocationItems> {
    primary: {
        is_active?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        is_mirrored?: PrismicBoolean;
    };
    // helpers to define component elements outside of slice
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
}

export const MapSlice: React.FC<MapSliceType> = ({
    primary: { is_inverted, is_mirrored },
    items,
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
}) => {
    return (
        <Map
            isInverted={is_inverted}
            isMirrored={is_mirrored}
            initialLocation={items?.length > 0 ? `location-0` : undefined}
            center={center}
            zoom={zoom}
            flyToZoom={flyToZoom || 12}
            flyToControl={flyToControl || <FlyToIcon />}
            allMarkersOnInit={allMarkersOnInit}
            fitBoundsPadding={fitBoundsPadding || [30, 30]}
            locations={items?.map((location, i) => {
                const posLat = location.position?.latitude || 0;
                const posLng = location.position?.longitude || 0;

                return {
                    id: `location-${i}`,
                    position: [posLat, posLng],
                    meta: {
                        title: getHtmlText(location.title),
                        titleAs: 'div',
                        superTitle: getText(location.super_title),
                        superTitleAs: getHeadlineTag(location.super_title),
                        primaryLabel: getText(location.primary_label),
                        primaryLink:
                            resolveUnknownLink(location.primary_link) || '',
                        secondaryLabel: getText(location.secondary_label),
                        secondaryLink:
                            resolveUnknownLink(location.secondary_link) || '',
                        contact: [],
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
            primaryAction={({ isInverted, label, href }) =>
                primaryAction &&
                primaryAction({
                    isInverted: isInverted,
                    label: getText(label),
                    href: resolveUnknownLink(href) || '',
                    isExternal: isPrismicLinkExternal(href),
                })
            }
            secondaryAction={({ isInverted, label, href }) =>
                secondaryAction &&
                secondaryAction({
                    isInverted: isInverted,
                    label: getText(label),
                    href: resolveUnknownLink(href) || '',
                    isExternal: isPrismicLinkExternal(href),
                })
            }
            controlNext={controlNext}
            controlPrev={controlPrev}
            dot={dot}
        />
    );
};
