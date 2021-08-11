import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    PrismicImage,
    getPrismicImage as getImg,
    getText,
    getImageFromUrl,
    PrismicSelectField,
    mapPrismicSelect,
} from 'utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from 'utils/mapping';
import { NewsAuthorCard } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

const imageSizes = {
    main: {
        small: { width: 150, height: 150 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;

type BgMode = 'full' | 'inverted';
export interface NewsAuthorCardSliceType extends PrismicSlice<'NewsAuthor'> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        author_label?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const NewsAuthorCardSlice: React.FC<NewsAuthorCardSliceType> = ({
    primary: { bg_mode, author_name, author_image, author_label },
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    const introImageUrl = author_image && getImg(author_image).url;
    const mappedImage =
        (introImageUrl && {
            ...getImageFromUrl(
                introImageUrl,
                imageSizes.main,
                getText(author_image?.alt)
            ),
        }) ||
        undefined;

    return (
        <NewsAuthorCard
            author={getText(author_name)}
            avatar={mappedImage && { src: mappedImage.small || '' }}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            label={getText(author_label) || 'Geschrieben von'}
        />
    );
};
