import { Document } from 'prismic-javascript/types/documents';

import { ArticleSliceType } from '../slices/Article';

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
export interface PrismicImage {
    url?: string;
    alt?: string;
    ExtraLarge?: {
        url?: string;
        alt?: string;
    };
    Large?: {
        url?: string;
        alt?: string;
    };
    Medium?: {
        url?: string;
        alt?: string;
    };
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
        name: PrismicHeading;
        pagetitle: PrismicKeyText;
        socialslogo?: PrismicImage;
        menutitle: PrismicKeyText;
        metadescription: PrismicKeyText;
        navpoints: PrismicPage;
        pulled: PrismicBoolean;
        uid: string;
        body: Array<ArticleSliceType>;
    };
}

export interface PrismicNavigationSliceType {
    primary: {
        label?: PrismicHeading;
        link?: PrismicLink;
    };
    items: never[];
}
export interface PrismicSettingsPage extends Document {
    data: {
        logo?: PrismicImage;
        logohref?: PrismicLink;
        menudecorator?: PrismicImage;
        booking?: [
            {
                actionlabel?: PrismicKeyText;
                actionlink?: PrismicLink;
            }
        ];

        conttitle?: PrismicHeading;
        conttext?: PrismicRichText;
        maillabel?: PrismicKeyText;
        emaillink?: PrismicLink;
        phonenumber?: PrismicKeyText;
        phonenumberlink?: PrismicLink;
        mobilenumber?: PrismicKeyText;
        mobilelink?: PrismicLink;

        website?: PrismicKeyText;
        websitelink?: PrismicLink;
        youtube?: PrismicLink;
        instagram?: PrismicLink;
        facebook?: PrismicLink;

        certtitle?: PrismicHeading;
        certtext?: PrismicRichText;
        certificates?: { certlogo: PrismicImage }[];
        sponstitle?: PrismicHeading;
        sponstext?: PrismicRichText;
        sponsinfo?: PrismicKeyText;
        sponsinfolink?: PrismicLink;
        sponsors?: { logo: PrismicImage }[];
        policy?: PrismicLink;
        impressum?: PrismicLink;
        terms?: PrismicLink;

        body?: PrismicNavigationSliceType[];
    };
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

export type AliasMapperType<TargetType extends string> = {
    [key in TargetType]: string;
};

export const mapPrismicSelect = <TargetType extends string>(
    aliasMapper: AliasMapperType<TargetType>,
    prismicSelectValue?: PrismicSelectField
) => {
    let alias = undefined;
    for (const key in aliasMapper) {
        // check if mapper contains alias (value) that matches with prismic select value
        if (aliasMapper[key] === prismicSelectValue) {
            // if found use key of mapper (= key of TargetType)
            alias = key;
            break;
        }
    }
    return alias;
};

export const isPrismicLinkEmpty = (prismicLink: PrismicLink) => {
    return prismicLink.link_type === 'Any';
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
