import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    isPrismicLinkExternal,

    resolveUnknownLink,
    getText,
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsTable } from '@blateral/b.kit';
import React from 'react';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsTableSliceType extends PrismicSlice<'NewsTable'> {
    primary: {
        is_active?: PrismicBoolean;
        title?: PrismicHeading;
        table?: PrismicRichText;
        is_inverted?: PrismicBoolean;
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
}

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    primary: {
        table,
        is_inverted,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <NewsTable
            tableItems={[
                {
                    rowTitle: [
                        'Table Headline',
                        'Table Headline',
                        'Table Headline',
                        'Table Headline',
                    ],
                    row: [
                        {
                            cols: [
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                            ],
                        },
                        {
                            cols: [
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                            ],
                        },
                        {
                            cols: [
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                            ],
                        },
                        {
                            cols: [
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                                'Lorem ipsum dolor sit amet',
                            ],
                        },
                    ],
                }]}
            isInverted={is_inverted}
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
