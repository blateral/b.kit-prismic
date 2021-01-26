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

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

// recursice deep assign function
export const assignTo = <T, S>(target: T, source: RecursivePartial<S>) => {
    Object.keys(source).forEach((key) => {
        const sourceVal = source[key];
        const targetVal = target[key];
        target[key] =
            targetVal &&
            sourceVal &&
            typeof targetVal === 'object' &&
            typeof sourceVal === 'object'
                ? assignTo(targetVal, sourceVal)
                : sourceVal;
    });
    return target;
};

// Add / Update a key-value pair in the URL query parameters
export const updateUrlParameters = (
    uri: string,
    params: { [key: string]: string }
) => {
    // remove the hash part before operating on the uri
    const i = uri.indexOf('#');
    const hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

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
};
