import {
    AliasSelectMapperType,
    ImageSettingsProps,
    updateUrlParameters,
} from './mapping';

import { ArticleSliceType } from 'slices/Article';
import { CrossPromotionSliceType } from 'slices/CrossPromotion';
import { Document } from 'prismic-javascript/types/documents';
import { FactListSliceType } from 'slices/FactList';
import { FeatureListSliceType } from 'slices/FeatureList';
import { GallerySliceType } from 'slices/Gallery';
import { HeaderSliceType } from 'slices/Header';
import { IconListSliceType } from 'slices/IconList';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { PosterSliceType } from 'slices/Poster';
import { RichText } from 'prismic-dom';
import { TeaserSliceType } from 'slices/Teaser';
import { VideoSliceType } from 'slices/Video';
import { PromotionCarouselSliceType } from 'slices/PromotionCarousel';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

/****** Types ******/
export interface PrismicSlice<S, I = any> {
    slice_type: S;
    primary: Record<string, unknown>;
    items: I[];
}

export type PrismicHeading = Array<{
    type:
        | 'heading1'
        | 'heading2'
        | 'heading3'
        | 'heading4'
        | 'heading5'
        | 'heading6';
    text: string;
}>;

export type PrismicBoolean = boolean;
export type PrismicColorPicker = string | null;
export type PrismicDatePicker = string | null;
export type PrismicKeyText = string | null;
export type PrismicLink =
    | {
          link_type: 'Any';
          url?: string;
      }
    | {
          link_type: 'Web';
          url: string;
          target?: '_blank';
      }
    | {
          link_type: 'Media';
          url: string;
      }
    | (Document & {
          link_type: 'Document';
      });
export type PrismicNumber = number | null;
export type PrismicRichText = Array<{
    type:
        | 'heading1'
        | 'heading2'
        | 'heading3'
        | 'heading4'
        | 'heading5'
        | 'heading6'
        | 'paragraph';
    text: string;
}>;
export type PrismicSelectField = string | null;
export type PrismicTimeStamp = string | null;
export type PrismicUid = string | null;
export interface PrismicColor extends Document {
    data: {
        name: PrismicHeading;
        color: string;
    };
}

export interface PrismicEmbed {
    author_name?: string;
    author_url?: string;
    embed_url?: string;
    height?: number;
    html?: string;
    provider_name?: string;
    provider_url?: string;
    thumbnail_height?: number;
    thumbnail_url?: string;
    thumbnail_width?: number;
    title?: string;
    type?: 'video' | 'rich' | 'photo' | string;
    version?: string;
    width?: number;
}

export interface PrismicGeopoint {
    latitude: number;
    longitude: number;
}

interface PrismicImageProps {
    url: string;
    alt: string;
    dimensions: {
        height: number;
        width: number;
    };
}

export interface PrismicImage extends PrismicImageProps {
    [key: string]:
        | string
        | { [key: string]: string | number }
        | PrismicImageProps;
}

export interface DefaultMappedImage {
    small: string;
    alt: string;
    medium?: string;
    large?: string;
    xlarge?: string;
}
export interface PrismicLinkToMedia {
    height?: string;
    kind?: string;
    link_type?: 'Media';
    name?: string;
    size?: string;
    url?: string;
    width?: string;
}

export interface PrismicPage extends Document {
    data: {
        uid: string;

        seo_socialimage?: PrismicImage;
        seo_title?: PrismicHeading;
        seo_description?: PrismicRichText;
        seo_keywords?: PrismicKeyText;
        seo_search_index?: PrismicBoolean;
        seo_trace_links?: PrismicBoolean;
        seo_content_group?: PrismicKeyText;
        seo_redirection?: PrismicLink;

        body: Array<
            | ArticleSliceType
            | GallerySliceType
            | FeatureListSliceType
            | VideoSliceType
            | PosterSliceType
            | FactListSliceType
            | IconListSliceType
            | HeaderSliceType
            | TeaserSliceType
            | CrossPromotionSliceType
            | PromotionCarouselSliceType
        >;
    };
}

export interface PrismicNavigationSliceType {
    primary: {
        footer_nav_title?: PrismicHeading;
        footer_nav_link?: PrismicLink;
    };
    items: never[];
}

export interface PrismicMainNavigationSliceType {
    primary: {
        name?: PrismicKeyText;
        is_small?: PrismicBoolean;
    };
    items?: Array<{
        label?: PrismicKeyText;
        link?: PrismicLink;
    }>;
}

export interface PrismicSettingsData {
    domain?: PrismicLink;
    contact?: PrismicRichText;

    socials?: Array<{
        platform?: PrismicKeyText;
        link?: PrismicLink;
    }>;

    logo_image_full?: PrismicImage;
    logo_image_full_inverted?: PrismicImage;
    logo_image_small?: PrismicImage;
    logo_image_small_inverted?: PrismicImage;
    logo_href?: PrismicLink;

    header_primary_label?: PrismicKeyText;
    header_primary_link?: PrismicLink;
    header_secondary_label?: PrismicKeyText;
    header_secondary_link?: PrismicLink;

    nav_primary_label?: PrismicKeyText;
    nav_primary_link?: PrismicLink;
    nav_secondary_label?: PrismicKeyText;
    nav_secondary_link?: PrismicLink;

    footer_newsletter_heading?: PrismicHeading;
    footer_newsletter_text?: PrismicRichText;
    footer_newsletter_placeholder?: PrismicKeyText;
    footer_newsletter_submit_label?: PrismicKeyText;

    footer_impressum?: PrismicLink;
    footer_policy?: PrismicLink;

    body?: PrismicNavigationSliceType[];

    main_nav?: PrismicMainNavigationSliceType[];
}
export interface PrismicSettingsPage extends Document {
    data: PrismicSettingsData;
}

export interface PrismicRelationship {
    id?: string;
    isBroken?: boolean;
    lang?: string;
    link_type: 'Document' | string;
    slug?: string;
    tags?: string[];
    type?: string;
}

export const linkResolver = (doc: Document) => {
    if (doc.type === 'page' && doc.uid !== 'start') return `/${doc.uid}`;
    return `/`;
};

export const resolveUnknownLink = (link: unknown): string | null => {
    if (typeof link === 'object' && link !== null && 'link_type' in link) {
        const mylink = link as PrismicLink;
        if (mylink.link_type === 'Any') {
            return null;
        }
        if (mylink.link_type === 'Web') {
            return mylink.url;
        }
        if (mylink.link_type === 'Document') {
            return linkResolver(mylink);
        }
        if (mylink.link_type === 'Media') {
            return mylink.url;
        }
        return null;
    }
    return null;
};

export const getHeadlineTag = (
    heading?: PrismicHeading
): HeadlineTag | undefined => {
    try {
        if (!heading || !heading[0] || !heading[0].type) throw Error();
        switch (heading[0].type) {
            case 'heading1':
                return 'h1';
            case 'heading2':
                return 'h2';
            case 'heading3':
                return 'h3';
            case 'heading4':
                return 'h4';
            case 'heading5':
                return 'h5';
            case 'heading6':
                return 'h6';
            default:
                return undefined;
        }
    } catch (e) {
        console.log(e);
        return undefined;
    }
};

export const mapPrismicSelect = <TargetType extends string>(
    aliasMapper?: AliasSelectMapperType<TargetType>,
    prismicSelectValue?: PrismicSelectField
) => {
    let alias = undefined;
    try {
        if (!aliasMapper || !prismicSelectValue) throw new Error();
        for (const key in aliasMapper) {
            // check if mapper contains alias (value) that matches with prismic select value
            if (aliasMapper?.[key] && aliasMapper[key] === prismicSelectValue) {
                // if found use key of mapper (= key of TargetType)
                alias = key;
                break;
            }
        }
    } catch (e) {
        console.log(e);
    }
    return alias;
};

// Try to get generic sub image from prismic image object
export const getPrismicImage = (prismicImage: PrismicImage, key?: string) => {
    try {
        if (!key || !prismicImage) throw new Error();
        if (!(key in prismicImage) || typeof prismicImage?.[key] !== 'object')
            throw new Error();

        return prismicImage[key] as PrismicImage;
    } catch {
        // return default prismic image (main)
        return prismicImage;
    }
};

// getting default image from prismic image url
export const getImageFromUrl = (
    url: string,
    sizeSettings: ImageSettingsProps,
    altText = ''
) => {
    const newImage: ImageProps = {
        small: updateUrlParameters(url, {
            w: `${sizeSettings.small.width}`,
            h: `${sizeSettings.small.height}`,
        }),
        medium:
            sizeSettings.medium &&
            updateUrlParameters(url, {
                w: `${sizeSettings.medium?.width}`,
                h: `${sizeSettings.medium?.height}`,
            }),
        semilarge:
            sizeSettings.semilarge &&
            updateUrlParameters(url, {
                w: `${sizeSettings.semilarge?.width}`,
                h: `${sizeSettings.semilarge?.height}`,
            }),
        large:
            sizeSettings.large &&
            updateUrlParameters(url, {
                w: `${sizeSettings.large?.width}`,
                h: `${sizeSettings.large?.height}`,
            }),
        xlarge:
            sizeSettings.xlarge &&
            updateUrlParameters(url, {
                w: `${sizeSettings.xlarge?.width}`,
                h: `${sizeSettings.xlarge?.height}`,
            }),
        alt: altText,
    };

    return newImage;
};

export const getImageFromUrls = (
    urls: { [key in keyof Omit<ImageProps, 'coverSpace' | 'alt'>]: string },
    sizeSettings: ImageSettingsProps,
    altText = ''
) => {
    const newImage: ImageProps = {
        small: updateUrlParameters(urls.small, {
            w: `${sizeSettings.small.width}`,
            h: `${sizeSettings.small.height}`,
        }),
        medium:
            sizeSettings.medium &&
            urls.medium &&
            updateUrlParameters(urls.medium, {
                w: `${sizeSettings.medium?.width}`,
                h: `${sizeSettings.medium?.height}`,
            }),
        semilarge:
            sizeSettings.semilarge &&
            urls.semilarge &&
            updateUrlParameters(urls.semilarge, {
                w: `${sizeSettings.semilarge?.width}`,
                h: `${sizeSettings.semilarge?.height}`,
            }),
        large:
            sizeSettings.large &&
            urls.large &&
            updateUrlParameters(urls.large, {
                w: `${sizeSettings.large?.width}`,
                h: `${sizeSettings.large?.height}`,
            }),
        xlarge:
            sizeSettings.xlarge &&
            urls.xlarge &&
            updateUrlParameters(urls.xlarge, {
                w: `${sizeSettings.xlarge?.width}`,
                h: `${sizeSettings.xlarge?.height}`,
            }),
        alt: altText,
    };

    return newImage;
};

export const isPrismicLinkEmpty = (prismicLink: PrismicLink | string) => {
    const type = (prismicLink as PrismicLink).link_type;
    return type ? type === 'Any' : prismicLink === '';
};

export const isPrismicLinkExternal = (prismicLink?: PrismicLink | string) => {
    return prismicLink &&
        (prismicLink as any).target &&
        (prismicLink as any).target === '_blank'
        ? true
        : false;
};

export const isRichTextEmpty = (prismicRichText: PrismicRichText) => {
    return prismicRichText.length === 1 && prismicRichText[0].text === '';
};

export const getText = (
    prismicValue?: PrismicRichText | PrismicKeyText | string
) => {
    let text: string;
    try {
        if (!prismicValue) throw new Error();
        if (typeof prismicValue !== 'string') {
            if (isRichTextEmpty(prismicValue)) text = '';
            else text = RichText.asText(prismicValue);
        } else {
            text = prismicValue;
        }
    } catch {
        text = '';
    }
    return text;
};

export const getHtmlText = (prismicValue?: PrismicRichText) => {
    let text = '';
    try {
        if (!prismicValue) throw new Error();
        if (typeof prismicValue !== 'string') {
            if (isRichTextEmpty(prismicValue)) text = '';
            else text = RichText.asHtml(prismicValue, linkResolver);
        } else {
            text = prismicValue;
        }
    } catch {
        text = '';
    }
    return text;
};
