import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    PrismicImage,
    isPrismicLinkExternal,
    resolveUnknownLink,
    getText,
    getHtmlText,
} from '../utils/prismic';

import { CrossPromotion } from '@blateral/b.kit';
import React from 'react';

// type BgMode = 'full' | 'splitted';

interface CrossPromotionItems {
    is_main?: PrismicBoolean;
    size?: 'full' | 'half';
    image?: PrismicImage;
    title?: PrismicHeading;
}

export interface CrossPromotionSliceType
    extends PrismicSlice<'CrossPromotion', CrossPromotionItems> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        is_mirrored?: PrismicBoolean;
        bg_mode?: PrismicSelectField;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    // bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
}

export const CrossPromotionSlice: React.FC<CrossPromotionSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_mirrored,
        is_inverted,
        bg_mode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    // bgModeSelectAlias = {
    //     full: 'full',
    //     splitted: 'splitted',
    // },
    items,
    primaryAction,
    secondaryAction,
}) => {
    return (
        <CrossPromotion
            isInverted={is_inverted}
            isMirrored={is_mirrored}
            superTitle={getText(super_title)}
            title={getText(title)}
            text={getHtmlText(text)}
            main={items
                .filter((item) => item.is_main)
                .map((item) => {
                    return {
                        size: item.size || 'full',
                        image: {
                            small: item?.image?.url || '',
                            alt: item?.image?.alt || '',
                        },
                        title: getText(item.title) || '',
                    };
                })}
            aside={items
                .filter((item) => !item.is_main)
                .map((item) => {
                    return {
                        size: item.size || 'full',
                        image: {
                            small: item?.image?.url || '',
                            alt: item?.image?.alt || '',
                        },
                        title: getText(item.title) || '',
                    };
                })}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryAction={(isInverted) =>
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
