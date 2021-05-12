import React from 'react';
import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    PrismicLink,
    resolveUnknownLink,
    PrismicImage,
    isPrismicLinkExternal,
    getPrismicImage as getImg,
    getImageFromUrl,
    PrismicKeyText,
    getText,
    getHtmlText,
    PrismicSelectField,
    mapPrismicSelect,
    getHeadlineTag,
} from 'utils/prismic';
import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';

import { Video, VideoCarousel } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { ResponsiveObject } from './slick';

type BgMode = 'full' | 'splitted';
export interface VideoCardItem {
    bg_image: PrismicImage;
    embed_id: PrismicKeyText;
}
export interface VideoSliceType extends PrismicSlice<'Video', VideoCardItem> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        bg_mode?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
    beforeChange?: (props: { currentStep: number; nextStep: number }) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
    playIcon?: React.ReactChild;
}

// for this component defines image sizes
const imageSizes = {
    main: {
        small: { width: 640, height: 480 },
        medium: { width: 1024, height: 576 },
        large: { width: 1440, height: 810 },
        xlarge: { width: 1680, height: 810 },
    },
} as ImageSizeSettings<{ main: string }>;

export const VideoSlice: React.FC<VideoSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    items,
    bgModeSelectAlias = {
        full: 'full',
        splitted: 'splitted',
    },
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
    playIcon,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    const shardProps = {
        isInverted: is_inverted,
        title: getText(title),
        titleAs: getHeadlineTag(title),
        superTitle: getText(super_title),
        superTitleAs: getHeadlineTag(super_title),
        text: getHtmlText(text),
        primaryAction: (isInverted: boolean) =>
            primaryAction &&
            primaryAction({
                isInverted,
                label: getText(primary_label),
                href: resolveUnknownLink(primary_link) || '',
                isExternal: isPrismicLinkExternal(primary_link),
            }),
        secondaryAction: (isInverted: boolean) =>
            secondaryAction &&
            secondaryAction({
                isInverted,
                label: getText(secondary_label),
                href: resolveUnknownLink(secondary_link) || '',
                isExternal: isPrismicLinkExternal(secondary_link),
            }),
    };

    // if more than one items are defined create a carousel
    if (items.length > 1) {
        return (
            <VideoCarousel
                {...shardProps}
                bgMode={bgMode}
                videos={items.map((item) => {
                    // get image url
                    const url = item.bg_image
                        ? getImg(item.bg_image, 'main').url
                        : '';
                    const mappedImage: ImageProps = {
                        ...getImageFromUrl(
                            url,
                            imageSizes.main,
                            getText(item.bg_image?.alt)
                        ),
                    };

                    return {
                        embedId: getText(item.embed_id),
                        bgImage: mappedImage,
                        playIcon: playIcon,
                    };
                })}
                controlNext={controlNext}
                controlPrev={controlPrev}
                beforeChange={beforeChange}
                afterChange={afterChange}
                onInit={onInit}
                dot={dot}
                slidesToShow={slidesToShow}
                responsive={responsive}
            />
        );
    } else {
        // get first video item
        const embedId = items[0] && items[0].embed_id;
        const bgImage = items[0] && items[0].bg_image;

        // get image url
        const url = bgImage ? getImg(bgImage, 'main').url : '';
        const mappedImage: ImageProps = {
            ...getImageFromUrl(url, imageSizes.main, getText(bgImage?.alt)),
        };

        return (
            <Video
                {...shardProps}
                hasBack={bgMode === 'full' || bgMode === 'splitted'}
                bgImage={mappedImage}
                embedId={getText(embedId)}
                playIcon={playIcon}
            />
        );
    }
};
