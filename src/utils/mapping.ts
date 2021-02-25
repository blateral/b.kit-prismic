import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';

export type AliasSelectMapperType<TargetType extends string> = {
    [key in TargetType]: string;
};

export type AliasMapperType<TargetType> = {
    [key in keyof TargetType]: string;
};

export type ImageSizeSettings<ImageSizeProps> = {
    [key in keyof ImageSizeProps]: ImageSettingsProps;
};

export type ImageSettingsProps = {
    [key in keyof Omit<ImageProps, 'coverSpace' | 'alt'>]: {
        width: number;
        height: number;
    };
};

export const isSVG = (url?: string) => {
    return url ? /\.(svg)$/i.test(url) : false;
};

// Add / Update a key-value pair in the URL query parameters
export const updateUrlParameters = (
    uri: string,
    params: { [key: string]: string }
) => {
    try {
        // remove the hash part before operating on the uri
        const i = uri.indexOf('#');
        const hash = i === -1 ? '' : uri.substr(i);
        uri = i === -1 ? uri : uri.substr(0, i);

        // check if image url has svg filename
        if (uri.indexOf('.svg') !== -1)
            throw Error(
                'SVG images are not supported by imgIx! more at: https://support.imgix.com/hc/en-us/articles/204280985#svg_s'
            );

        const separator = uri.indexOf('?') !== -1 ? '&' : '?';

        Object.keys(params).forEach((key) => {
            const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');

            if (uri.match(re)) {
                uri = uri.replace(re, '$1' + key + '=' + params[key] + '$2');
            } else {
                uri = uri + separator + key + '=' + params[key];
            }
        });
        return uri + hash; // finally append the hash as well
    } catch (e) {
        console.warn(e);
        return uri;
    }
};
