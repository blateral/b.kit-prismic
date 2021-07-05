import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    PrismicImage,
    getHtmlText,
    getPrismicImage as getImg,
    getImageFromUrls,
    getText,

} from '../../utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from '../../utils/mapping';
import { NewsIntro } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';


const imageSizes = {
    main: {
        small: { width: 619, height: 348 },
        medium: { width: 791, height: 445 },
        semilarge: { width: 944, height: 531 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;
export interface NewsIntroSliceType extends PrismicSlice<'NewsIntro'> {
    primary: {
        is_active?: PrismicBoolean;
        intro_heading?: PrismicHeading;
        intro?: PrismicRichText;
        tag?: PrismicKeyText;
        news_image?: PrismicImage;
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


}

export const NewsIntroSlice: React.FC<NewsIntroSliceType> = ({
    primary: {
        tag,
        is_inverted,
        author_name,
        publication_date,
        news_image,
        intro,
        intro_heading,

    }

}) => {

    const introImageUrl = news_image && getImg(news_image).url;
    const mappedImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: introImageUrl || '',
                medium: introImageUrl,
                semilarge: introImageUrl,
            },
            imageSizes.main,
            getText(news_image?.alt)
        ),
    };


    const publicationDate = generatePublicationDateObject(publication_date);
    return (
        <NewsIntro
            title={getHtmlText(intro_heading)}
            text={getHtmlText(intro)}
            image={mappedImage}
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
    if (!publication_date) return undefined;

    const parts = publication_date?.split("/").filter(Boolean);
    try {
        const dateParts = parts[0].split("-").filter(Boolean);
        const timeParts = parts[1].split(":");

        const publicationDate = new Date(+dateParts[0], (+dateParts[1] - 1), +dateParts[2], +timeParts[0], +timeParts[1])

        return publicationDate;
    }
    catch (e) {
        console.error("Error in NewsIntro date generation. \n", e)
        return undefined;
    }

}

