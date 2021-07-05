import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicSlice,
    PrismicImage,
    getPrismicImage as getImg,
    getImageFromUrls,
    getText,

} from '../../utils/prismic';

import { AliasSelectMapperType, ImageSizeSettings } from '../../utils/mapping';
import { NewsAuthorCard } from '@blateral/b.kit';
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
        small: { width: 150, height: 150 }
    },
} as ImageSizeSettings<{ main: ImageProps }>;
export interface NewsVideoSliceType extends PrismicSlice<'NewsVideo'> {
    primary: {
        is_active?: PrismicBoolean;
        has_background?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        author_label?: PrismicKeyText

    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;


}

export const NewsVideoSlice: React.FC<NewsVideoSliceType> = ({
    primary: {
        is_inverted,
        has_background,
        author_name,
        author_image,
        author_label

    }

}) => {

    const introImageUrl = author_image && getImg(author_image).url;
    const mappedImage: ImageProps = {
        ...getImageFromUrls(
            {
                small: introImageUrl || ''
            },
            imageSizes.main,
            getText(author_image?.alt)
        ),
    };


    return (
        <NewsAuthorCard
            author={author_name || ""}
            avatar={{ src: mappedImage.small || "" }}
            hasBack={has_background}
            isInverted={is_inverted}
            label={author_label || "Geschrieben von"}


        />
    );
};
