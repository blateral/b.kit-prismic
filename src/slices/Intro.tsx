import { Intro } from '@blateral/b.kit';
import React from 'react';
import { AliasSelectMapperType } from 'utils/mapping';
import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isValidAction,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface IntroSliceType extends PrismicSlice<'Intro'> {
    primary: {
        is_active?: PrismicBoolean;

        title: PrismicHeading;
        super_title?: PrismicHeading;
        text?: PrismicRichText;

        is_centered?: PrismicBoolean;
        is_stackable?: PrismicBoolean;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;

        bg_mode?: PrismicSelectField;
    };

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
}

export const IntroSlice: React.FC<IntroSliceType> = ({
    primary: {
        title,
        super_title,
        text,
        is_centered,
        is_stackable,
        primary_label,
        primary_link,
        secondary_label,
        secondary_link,
        bg_mode,
    },
    bgModeSelectAlias = {
        full: 'soft',
        splitted: 'soft-splitted',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Intro
            bgMode={bgMode}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            text={getHtmlText(text)}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted: boolean) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted: boolean) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
            isStackable={is_stackable}
            isCentered={is_centered}
        />
    );
};
