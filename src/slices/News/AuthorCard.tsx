import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    PrismicImage,
    getPrismicImage as getImg,
    getText,
    getImageFromUrl,
} from 'utils/prismic';

import { ImageSizeSettings } from 'utils/mapping';
import { NewsAuthorCard } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

const imageSizes = {
    main: {
        small: { width: 150, height: 150 },
    },
} as ImageSizeSettings<{ main: ImageProps }>;
export interface NewsAuthorCardSliceType extends PrismicSlice<'NewsAuthor'> {
    primary: {
        is_active?: PrismicBoolean;
        has_background?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        author_label?: PrismicKeyText;
    };
}

export const NewsAuthorCardSlice: React.FC<NewsAuthorCardSliceType> = ({
    primary: {
        is_inverted,
        has_background,
        author_name,
        author_image,
        author_label,
    },
}) => {
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
            hasBack={has_background}
            isInverted={is_inverted}
            label={getText(author_label) || 'Geschrieben von'}
        />
    );
};
