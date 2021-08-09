import {
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    isValidAction,
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
} from 'utils/prismic';

import React from 'react';
import { Form } from '@blateral/b.kit';
import {
    FormDataErrors,
    FormData,
    FormFieldProps,
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
        isDisabled?: boolean;
        label?: string;
        additionalProps?: { type: 'submit'; as: 'button' | 'a' };
    }) => React.ReactNode;
    validation?: (values: FormData, errors: FormDataErrors) => FormDataErrors;
    yupValidationSchema?: any;
    onSubmit?: (props: { mail: MailInfo; data: FormData }) => void;
    fieldSettings?: {
        [key in keyof FormData]: FormFieldProps;
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
    fieldSettings,
}) => {
    return (
        <Form
            isInverted={is_inverted}
            hasBack={has_back}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            intro={getHtmlText(intro)}
            formFields={{
                name: {
                    isRequired: fieldSettings?.name?.isRequired,
                    infoMessage: fieldSettings?.name?.infoMessage,
                    label: fieldSettings?.name?.label,
                },
                surname: {
                    isRequired: fieldSettings?.surname?.isRequired,
                    infoMessage: fieldSettings?.surname?.infoMessage,
                    label: fieldSettings?.surname?.label,
                },
                mail: {
                    isRequired: fieldSettings?.mail?.isRequired,
                    infoMessage: fieldSettings?.mail?.infoMessage,
                    label: fieldSettings?.mail?.label,
                },
                phone: {
                    isRequired: fieldSettings?.phone?.isRequired,
                    infoMessage: fieldSettings?.phone?.infoMessage,
                    label: fieldSettings?.phone?.label,
                },
                area: {
                    isRequired: fieldSettings?.area?.isRequired,
                    infoMessage: fieldSettings?.area?.infoMessage,
                    label: fieldSettings?.area?.label,
                },
            }}
            checkbox={{
                label: getHtmlText(checkbox_label),
            }}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
            submitAction={
                submitAction && submit_label
                    ? ({ isInverted, isDisabled, additionalProps }) =>
                          submitAction({
                              isInverted,
                              isDisabled,
                              additionalProps,
                              label: getText(submit_label),
                          })
                    : undefined
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
