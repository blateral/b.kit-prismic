import {
    AliasSelectMapperType,
    ImageSettingsProps,
    isSVG,
    updateUrlParameters,
} from './mapping';

import { ArticleSliceType } from 'slices/Article';
import { CallToActionSliceType } from 'slices/CallToAction';
import { CrossPromotionListSliceType } from 'slices/CrossPromotionList';
import { Document } from 'prismic-javascript/types/documents';
import { FactListSliceType } from 'slices/FactList';
import { FactGridSliceType } from 'slices/FactGrid';
import { FeatureListSliceType } from 'slices/FeatureList';
import { GallerySliceType } from 'slices/Gallery';
import { HeaderSliceType } from 'slices/Header';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { IconListSliceType } from 'slices/IconList';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { MapSliceType } from 'slices/Map';
import { PosterSliceType } from 'slices/Poster';
import { RichText } from 'prismic-dom';
import { TableSliceType } from 'slices/Table';
import { TeaserSliceType } from 'slices/Teaser';
import { VideoSliceType } from 'slices/Video';
import { FormSliceType } from 'slices/Form';
import { ComparisonSliderSliceType } from 'slices/ComparisonSlider';
import { NewsTextSliceType } from 'slices/News/Text';
import { NewsTableSliceType } from 'slices/News/Table';
import { NewsIntroSliceType } from 'slices/News/Intro';
import { NewsVideoSliceType } from 'slices/News/Video';
import { NewsListSliceType } from 'slices/News/List';
import { NewsImagesSliceType } from 'slices/News/Images';
import { NewsOverviewSliceType } from 'slices/News/Overview';
import { IntroSliceType } from 'slices/Intro';
import { AccordionSliceType } from 'slices/Accordion';
import { QuickNavSliceType } from 'slices/QuickNav';

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

export interface PrismicNewsPage extends Document {
    data: {
        uid: PrismicUid;
        pagetitle?: PrismicHeading;
        seo_socialimage?: PrismicImage;
        seo_description?: PrismicRichText;
        seo_keywords?: PrismicKeyText;
        seo_search_index?: PrismicBoolean;
        seo_trace_links?: PrismicBoolean;
        seo_content_group?: PrismicKeyText;
        seo_redirection?: PrismicLink;

        nav_isinverted?: PrismicBoolean;
        nav_withtopoffset?: PrismicBoolean;
        nav_menuicon?: PrismicSelectField;

        nav_allowtopbaroverflow?: PrismicBoolean;

        news_image?: PrismicImage;
        news_heading?: PrismicHeading;
        news_intro?: PrismicRichText;
        news_footer_inverted?: PrismicBoolean;
        news_footer_background?: PrismicBoolean;

        publication_date?: PrismicKeyText;

        primary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_link?: PrismicLink;
        secondary_label?: PrismicKeyText;

        author_label?: PrismicKeyText;
        author_name?: PrismicKeyText;
        author_image?: PrismicImage;
        author_has_background?: PrismicBoolean;
        author_is_inverted?: PrismicBoolean;

        body: Array<
            | NewsTextSliceType
            | NewsTableSliceType
            | NewsIntroSliceType
            | NewsVideoSliceType
            | NewsImagesSliceType
        >;
    };
}

export interface QuickNavDataPage extends Document {
    data: {
        quicknav_links?: {
            label: PrismicKeyText;
            link: PrismicLink;
        }[];
    };
}
export interface PrismicPage extends Document {
    data: {
        uid: PrismicUid;
        pagetitle?: PrismicHeading;
        seo_socialimage?: PrismicImage;
        seo_description?: PrismicRichText;
        seo_keywords?: PrismicKeyText;
        seo_search_index?: PrismicBoolean;
        seo_trace_links?: PrismicBoolean;
        seo_content_group?: PrismicKeyText;
        seo_redirection?: PrismicLink;

        nav_isinverted?: PrismicBoolean;
        nav_withtopoffset?: PrismicBoolean;
        nav_menuicon?: PrismicSelectField;

        nav_allowtopbaroverflow?: PrismicBoolean;

        header_title?: PrismicHeading;
        header_intro?: PrismicRichText;
        header_size?: PrismicSelectField;
        header_video?: PrismicLink;
        header_images?: Array<{
            image?: PrismicImage;
        }>;
        header_buttonstyle?: PrismicBoolean;
        header_primary_label?: PrismicKeyText;
        header_primary_link?: PrismicLink;
        header_secondary_label?: PrismicKeyText;
        header_secondary_link?: PrismicLink;

        header_badge?: PrismicImage;
        header_badge_on_mobile?: PrismicBoolean;

        body: Array<
            | ArticleSliceType
            | GallerySliceType
            | FeatureListSliceType
            | VideoSliceType
            | PosterSliceType
            | FactListSliceType
            | FactGridSliceType
            | IconListSliceType
            | HeaderSliceType
            | TeaserSliceType
            | MapSliceType
            | CallToActionSliceType
            | CrossPromotionListSliceType
            | ComparisonSliderSliceType
            | TableSliceType
            | FormSliceType
            | NewsListSliceType
            | NewsOverviewSliceType
            | IntroSliceType
            | AccordionSliceType
            | QuickNavSliceType
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

export const getHtmlElementFromPrismicType = (
    props: PrismicHeading[0] | undefined
) => {
    if (!props) return 'div';

    switch (props.type) {
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
            return 'div';
    }
};

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

/**
 * Global prismic settings data for all pages
 */
export interface PrismicSettingsData {
    domain?: PrismicLink;
    is_inverted?: PrismicBoolean;
    contact?: PrismicRichText;

    socials?: Array<{
        platform?: PrismicKeyText;
        link?: PrismicLink;
    }>;

    logo_image_full?: PrismicImage;
    logo_image_full_inverted?: PrismicImage;
    logo_image_small?: PrismicImage;
    logo_image_small_inverted?: PrismicImage;
    logo_image_footer?: PrismicImage;
    logo_href?: PrismicLink;

    header_is_inverted?: PrismicBoolean;
    header_primary_label?: PrismicKeyText;
    header_primary_label_short?: PrismicKeyText;
    header_primary_link?: PrismicLink;
    header_secondary_label?: PrismicKeyText;
    header_secondary_label_short?: PrismicKeyText;
    header_secondary_link?: PrismicLink;

    menu_islargemenu?: PrismicBoolean;
    menu_ismenuinverted?: PrismicBoolean;
    menu_ismirrored?: PrismicBoolean;
    menu_buttonstyle?: PrismicBoolean;
    tb_istopbarinverted?: PrismicBoolean;
    tb_withtopbaroffset?: PrismicBoolean;
    tb_hidetopbarbackundermenu?: PrismicBoolean;

    footer_newsletter_heading?: PrismicHeading;
    footer_newsletter_text?: PrismicRichText;
    footer_newsletter_placeholder?: PrismicKeyText;
    footer_newsletter_submit_label?: PrismicKeyText;

    footer_bottomlinks?: { href?: PrismicLink; label?: PrismicKeyText }[];

    cookie_icon?: PrismicImage;
    cookie_title?: PrismicRichText;
    cookie_text?: PrismicRichText;
    cookie_decline_label?: PrismicKeyText;
    cookie_accept_label?: PrismicKeyText;

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
    if (doc.type === 'news_page') return `/news/${doc.uid}`;
    if (doc.type === 'page' && doc.uid !== 'start') return `/${doc.uid}`;
    return `/`;
};

/**
 * Resolve unknown link to valid url string
 * @param link Link e.g. url string or Prismic link object
 */
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

/**
 * Get headline type from Prismic headline object
 * @param heading Heading object from prismic CMS
 */
export const getHeadlineTag = (
    heading?: PrismicHeading
): HeadlineTag | undefined => {
    if (!heading || !heading[0] || !heading[0].type) return undefined;

    try {
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
                throw new Error('Heading type is not defined!');
        }
    } catch (e) {
        console.warn(e);
        return undefined;
    }
};

/**
 * Map prismic select value to own key names
 * @param aliasMapper Mapper with keys as values for the component and values as keys from prismic select
 * @param prismicSelectValue Select value from prismic CMS
 */
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

/**
 * Try to get a prismic sub image (art direction) e.g. that has a different format
 * @desc Returns the given prismic image if no sub image can be found
 * @param prismicImage Prismic image with potential some sub image formats
 * @param key Sub image format key (e.g. medium, large, xlarge...)
 */
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

/**
 * Get image object from prismic image url
 * @desc It is only possible to resize with the already given image format from the url. So you need to pass the right url for the needed image ratio.
 * @param url Image url from prismic CMS
 * @param sizeSettings Settings object for the different image sizes.
 * @param altText Alternative text for the image
 */
export const getImageFromUrl = (
    url: string,
    sizeSettings: ImageSettingsProps,
    altText = ''
) => {
    const newImage: ImageProps = {
        small:
            url && !isSVG(url)
                ? updateUrlParameters(url, {
                      w: `${sizeSettings.small.width}`,
                      h: `${sizeSettings.small.height}`,
                  })
                : url,
        medium:
            sizeSettings.medium && url && !isSVG(url)
                ? updateUrlParameters(url, {
                      w: `${sizeSettings.medium?.width}`,
                      h: `${sizeSettings.medium?.height}`,
                  })
                : undefined,
        semilarge:
            sizeSettings.semilarge && url && !isSVG(url)
                ? updateUrlParameters(url, {
                      w: `${sizeSettings.semilarge?.width}`,
                      h: `${sizeSettings.semilarge?.height}`,
                  })
                : undefined,
        large:
            sizeSettings.large && url && !isSVG(url)
                ? updateUrlParameters(url, {
                      w: `${sizeSettings.large?.width}`,
                      h: `${sizeSettings.large?.height}`,
                  })
                : undefined,
        xlarge:
            sizeSettings.xlarge && url && !isSVG(url)
                ? updateUrlParameters(url, {
                      w: `${sizeSettings.xlarge?.width}`,
                      h: `${sizeSettings.xlarge?.height}`,
                  })
                : undefined,
        alt: altText,
    };

    return newImage;
};

/**
 * Get image object from multiple prismic image urls.
 * @desc It is only possible to resize with the already given image format from the url. So you need to pass the right url for each image ratio.
 * @param urls Object of different url e.g. with different image formats/ratios
 * @param sizeSettings Settings object for the different image sizes.
 * @param altText Alternative text for the image
 */
export const getImageFromUrls = (
    urls: { [key in keyof Omit<ImageProps, 'coverSpace' | 'alt'>]: string },
    sizeSettings: ImageSettingsProps,
    altText = ''
) => {
    const newImage: ImageProps = {
        small:
            urls.small && !isSVG(urls.small)
                ? updateUrlParameters(urls.small, {
                      w: `${sizeSettings.small.width}`,
                      h: `${sizeSettings.small.height}`,
                  })
                : urls.small,
        medium:
            sizeSettings.medium && urls.medium && !isSVG(urls.medium)
                ? updateUrlParameters(urls.medium, {
                      w: `${sizeSettings.medium?.width}`,
                      h: `${sizeSettings.medium?.height}`,
                  })
                : undefined,
        semilarge:
            sizeSettings.semilarge && urls.semilarge && !isSVG(urls.semilarge)
                ? updateUrlParameters(urls.semilarge, {
                      w: `${sizeSettings.semilarge?.width}`,
                      h: `${sizeSettings.semilarge?.height}`,
                  })
                : undefined,
        large:
            sizeSettings.large && urls.large && !isSVG(urls.large)
                ? updateUrlParameters(urls.large, {
                      w: `${sizeSettings.large?.width}`,
                      h: `${sizeSettings.large?.height}`,
                  })
                : undefined,
        xlarge:
            sizeSettings.xlarge && urls.xlarge && !isSVG(urls.xlarge)
                ? updateUrlParameters(urls.xlarge, {
                      w: `${sizeSettings.xlarge?.width}`,
                      h: `${sizeSettings.xlarge?.height}`,
                  })
                : undefined,
        alt: altText,
    };

    return newImage;
};

/**
 * Check if prismic link object is empty
 * @param prismicLink Prismic link object
 */
export const isPrismicLinkEmpty = (prismicLink?: PrismicLink | string) => {
    return !prismicLink ||
        (prismicLink && (prismicLink as PrismicLink).link_type === 'Any')
        ? true
        : false;
};

/**
 * Check if prismic link is external (e.g. target="_blank")
 * @param prismicLink Prismic link object
 */
export const isPrismicLinkExternal = (prismicLink?: PrismicLink | string) => {
    return prismicLink &&
        (prismicLink as any).target &&
        (prismicLink as any).target === '_blank'
        ? true
        : false;
};

/**
 * Check if prismic rich text is empty
 * @param prismicRichText Prismic rich text object
 */
export const isRichTextEmpty = (prismicRichText: PrismicRichText) => {
    return prismicRichText.length === 1 && prismicRichText[0].text === '';
};

/**
 * Get text string from different prismic text objects
 * @desc Always returning a string. HTML elements are not interpreted.
 * @param prismicValue Prismic rich text, key text or a simple string
 */
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

/**
 * Get text or rich text string from prismic rich text object
 * @desc Always returning a string. HTML elements are interpreted.
 * @param prismicValue Prismic rich text or a simple string
 */
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

export const isValidAction = (label?: PrismicKeyText, link?: PrismicLink) => {
    return label && !isPrismicLinkEmpty(link);
};
