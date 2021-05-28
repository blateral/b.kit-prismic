import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from '../utils/prismic';

import React from 'react';
import { Form } from '@blateral/b.kit';
import {
    FormDataErrors,
    FormData,
} from '@blateral/b.kit/lib/components/sections/Form';

export interface FormSliceType extends PrismicSlice<'FactList'> {
    primary: {
        is_active?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        intro?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        has_back?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    submitAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
        additionalProps?: { type: string; as: 'button' | 'a' };
    }) => React.ReactNode;
    validation?: (values: FormData, errors: FormDataErrors) => FormDataErrors;
    yupValidationSchema?: any;
}

export const FactListSlice: React.FC<FormSliceType> = ({
    primary: {
        super_title,
        title,
        intro,
        is_inverted,
        has_back,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
    submitAction,
    yupValidationSchema,
    validation,
}) => {
    return (
        <Form
            isInverted={is_inverted}
            bgMode={has_back ? 'full' : undefined}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            intro={getHtmlText(intro)}
            formFields={{
                name: {
                    isRequired: true,
                },
                surname: {
                    isRequired: true,
                },
                mail: {
                    isRequired: true,
                },
                phone: {
                    infoMessage: '*Help extra info line option',
                },
                area: {
                    isRequired: true,
                },
            }}
            checkbox={{
                label: `Ich aktzeptiere die <a href="#0">Datenschutzbestimmungen</a>`,
            }}
            primaryAction={(isInverted) =>
                primaryAction &&
                primaryAction({
                    isInverted,
                    label: getText(primary_label),
                    href: resolveUnknownLink(primary_link) || '',
                    isExternal: isPrismicLinkExternal(primary_link),
                })
            }
            secondaryAction={(isInverted) =>
                secondaryAction &&
                secondaryAction({
                    isInverted,
                    label: getText(secondary_label),
                    href: resolveUnknownLink(secondary_link) || '',
                    isExternal: isPrismicLinkExternal(secondary_link),
                })
            }
            submitAction={({ isInverted, additionalProps }) =>
                submitAction &&
                submitAction({
                    isInverted,
                    additionalProps,
                    label: getText(secondary_label),
                    href: resolveUnknownLink(secondary_link) || '',
                    isExternal: isPrismicLinkExternal(secondary_link),
                })
            }
            validation={(values, errors) =>
                validation && validation(values, errors)
            }
            yupValidationSchema={yupValidationSchema}
            onSubmit={console.log}
        />
    );
};
