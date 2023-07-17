import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    PrismicImage,
    getPrismicImage as getImg,
    getImageFromUrls,
    getText,
    PrismicLink,
    isPrismicLinkExternal,
    resolveUnknownLink,
    isValidAction,
} from 'utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';

import React, { useContext } from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { NewsVideo } from '@blateral/b.kit';
import { PrismicContext } from 'utils/settings';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

const imageSizes = {
    main: {
        small: { width: 640, height: 480 },
        medium: { width: 1024, height: 576 },
        large: { width: 1440, height: 810 },
        xlarge: { width: 1680, height: 810 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;
export interface NewsVideoSliceType extends PrismicSlice<'NewsVideo'> {
    primary: {
        is_active?: PrismicBoolean;
        has_background?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        external_video?: PrismicLink;
        image?: PrismicImage;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;

        consent_text?: PrismicKeyText;
        consent_action_label?: PrismicKeyText;
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

    consentAction?: (props: {
        label: string;
        handleClick?: () => void;
        consentProps: Record<string, string>;
    }) => React.ReactNode;
    /**
     * Custom handler for play button click
     * @returns true if video should be played
     */
    onPlayClick?: () => Promise<boolean>;
}

export const NewsVideoSlice: React.FC<NewsVideoSliceType> = ({
    primary: {
        is_inverted,
        has_background,
        external_video,
        image,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        consent_text,
        consent_action_label,
    },
    primaryAction,
    secondaryAction,
    consentAction,
    onPlayClick,
}) => {
    const settingsCtx = useContext(PrismicContext);
    const introImageUrl = image && getImg(image).url;
    const mappedImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: introImageUrl || '',
                medium: introImageUrl || '',
                large: introImageUrl || '',
                xlarge: introImageUrl || '',
            },
            imageSizes.main,
            getText(image?.alt)
        ),
    };

    let embedId = external_video?.url?.split('v=')[1] || null;
    if (embedId) {
        const ampersandPosition = embedId.indexOf('&');
        if (ampersandPosition != -1) {
            embedId = embedId.substring(0, ampersandPosition);
        }
    }
    return (
        <NewsVideo
            embedId={embedId || ''}
            hasBack={has_background}
            isInverted={is_inverted}
            bgImage={mappedImage}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href:
                                  resolveUnknownLink(
                                      primary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href:
                                  resolveUnknownLink(
                                      secondary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
            consentText={getText(consent_text)}
            consentAction={
                consentAction && consent_action_label
                    ? ({ consentProps, handleClick }) =>
                          consentAction({
                              consentProps,
                              handleClick,
                              label: getText(consent_action_label),
                          })
                    : undefined
            }
            onPlayClick={onPlayClick}
        />
    );
};
