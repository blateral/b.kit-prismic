import React from 'react';

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
    getText,
    getImageFromUrl,
    PrismicSelectField,
    mapPrismicSelect,
} from 'utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';
import { NewsIntro } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode = 'full' | 'inverted';

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
        news_heading?: PrismicHeading;
        news_intro?: PrismicRichText;
        news_image?: PrismicImage;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        publication_date?: PrismicKeyText;
        bg_mode?: PrismicSelectField;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    tags?: string[];
}

export const NewsIntroSlice: React.FC<NewsIntroSliceType> = ({
    primary: {
        bg_mode,
        author_name,
        publication_date,
        news_image,
        news_intro,
        news_heading,
    },
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    tags,
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    const introImageUrl = news_image && getImg(news_image).url;
    const mappedImage = introImageUrl && {
        ...getImageFromUrl(
            introImageUrl,
            imageSizes.main,
            getText(news_image?.alt)
        ),
    };

    const publicationDate = generatePublicationDateObject(publication_date);
    return (
        <NewsIntro
            title={getText(news_heading)}
            text={getHtmlText(news_intro)}
            image={mappedImage || undefined}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tags={tags && tags.length > 0 ? [tags[0]] : []}
            onTagClick={(tag) => {
                window.location.href = `/news?selected=${encodeURI(tag)}`;
            }}
            meta={{
                author: author_name || '',
                date: publicationDate,
            }}
        />
    );
};
function generatePublicationDateObject(publication_date?: PrismicKeyText) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split('/').filter(Boolean);
    try {
        const dateParts = parts[0].split('-').filter(Boolean);

        const publicationDate = new Date(
            +dateParts[0],
            +dateParts[1] - 1,
            +dateParts[2]
        );

        return publicationDate;
    } catch (e) {
        console.error('Error in NewsIntro date generation. \n', e);
        return undefined;
    }
}
