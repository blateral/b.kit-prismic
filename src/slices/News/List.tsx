import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    isPrismicLinkExternal,

    resolveUnknownLink,
    getText,
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsList } from '@blateral/b.kit';
import React from 'react';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsListSliceType extends PrismicSlice<'NewsList'> {
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

export const NewsListSlice: React.FC<NewsListSliceType> = ({
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
        <NewsList
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
            list={[
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
                {
                    tag: 'Secondary Tag',
                    publishDate: 'Date',
                    newsLink: '#0',
                    title:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ',
                    text:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ',
                    image: {
                        small: 'https://unsplash.it/419/313?image=400',
                        medium: 'https://unsplash.it/983/736?image=400',
                        large: 'https://unsplash.it/1399/1048?image=400',
                        xlarge: 'https://unsplash.it/1400/1050?image=400',
                    },
                },
            ]}
        />
    );
};
