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

export interface MailInfo {
    targetMails?: string[];
    subjectText?: string;
    redirectUrl?: string;
}

export interface FormSliceType extends PrismicSlice<'Form'> {
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
        submit_label?: PrismicKeyText;
        checkbox_label?: PrismicRichText;

        subject_text?: PrismicKeyText;
        redirect_url?: PrismicLink;
        target_mails?: PrismicKeyText;
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
        additionalProps?: { type: 'submit'; as: 'button' | 'a' };
    }) => React.ReactNode;
    validation?: (values: FormData, errors: FormDataErrors) => FormDataErrors;
    yupValidationSchema?: any;
    onSubmit?: (props: { mail: MailInfo; data: FormData }) => void;
    infoLineMessages?: {
        [key in keyof FormData]: string;
    };
}

export const FormSlice: React.FC<FormSliceType> = ({
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
        submit_label,
        checkbox_label,

        subject_text,
        redirect_url,
        target_mails,
    },
    primaryAction,
    secondaryAction,
    submitAction,
    yupValidationSchema,
    validation,
    onSubmit,
    infoLineMessages,
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
                    infoMessage: infoLineMessages?.name,
                },
                surname: {
                    isRequired: true,
                    infoMessage: infoLineMessages?.surname,
                },
                mail: {
                    isRequired: true,
                    infoMessage: infoLineMessages?.mail,
                },
                phone: {
                    infoMessage: infoLineMessages?.phone,
                },
                area: {
                    infoMessage: infoLineMessages?.area,
                },
            }}
            checkbox={{
                label: getHtmlText(checkbox_label),
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
                    label: getText(submit_label),
                })
            }
            validation={
                validation
                    ? (values, errors) => validation(values, errors)
                    : undefined
            }
            yupValidationSchema={yupValidationSchema}
            onSubmit={(data) => {
                onSubmit &&
                    onSubmit({
                        mail: {
                            targetMails: target_mails
                                ?.replace(/\s+/g, '')
                                ?.split(',')
                                .map((mail) => getText(mail)),
                            redirectUrl: resolveUnknownLink(redirect_url) || '',
                            subjectText: getText(subject_text),
                        },
                        data,
                    });
            }}
        />
    );
};
