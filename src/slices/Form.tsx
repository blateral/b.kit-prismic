import {
    getHtmlText,
    getText,
    mapPrismicSelect,
    PrismicBoolean,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSelectField,
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
import { AliasSelectMapperType } from 'utils/mapping';

export interface MailInfo {
    targetMails?: string[];
    subjectText?: string;
    redirectUrl?: string;
}

type BgMode = 'full' | 'inverted';

export interface FormSliceType extends PrismicSlice<'Form'> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        submit_label?: PrismicKeyText;
        checkbox_label?: PrismicRichText;

        subject_text?: PrismicKeyText;
        redirect_url?: PrismicLink;
        target_mails?: PrismicKeyText;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
        bg_mode,
        submit_label,
        checkbox_label,

        subject_text,
        redirect_url,
        target_mails,
    },
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    submitAction,
    yupValidationSchema,
    validation,
    onSubmit,
    fieldSettings,
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Form
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
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
