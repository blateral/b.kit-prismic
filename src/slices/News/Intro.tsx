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
    PrismicImage,
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsIntro, NewsList } from '@blateral/b.kit';
import React from 'react';
import format from 'date-fns/format';

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
        tag?: PrismicKeyText;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        publication_date?: PrismicKeyText;
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
        tag,
        is_inverted,
        author_name,
        publication_date,
        author_image,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    }

}) => {

    const publicationDate = generatePublicationDateObject(publication_date);
    return (
        <NewsIntro
            title={"TITLE IN PRISMIC EINBAUEN"}
            isInverted={is_inverted}
            tag={tag || ""}
            meta={
                {
                    author: author_name || "",
                    date: publicationDate
                }
            }


        />
    );
};
function generatePublicationDateObject(publication_date?: PrismicKeyText) {
    if (!publication_date) return "";

    const parts = publication_date?.split("/").filter(Boolean);
    try {
        const dateParts = parts[0].split("-").filter(Boolean);
        const timeParts = parts[1].split(":");

        const publicationDate = new Date(+dateParts[0], (+dateParts[1] - 1), +dateParts[2], +timeParts[0], +timeParts[1])

        const result = format(publicationDate, "dd.MM.yyyy")
        return result;
    }
    catch (e) {
        console.error("Error in NewsIntro date generation. \n", e)
        return "";
    }

}

