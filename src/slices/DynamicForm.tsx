import {
    PrismicKeyText,
    PrismicRichText,
    PrismicSelectField,
    PrismicSlice,
    PrismicBoolean,
    PrismicImage,
    DynamicFormDataPage,
    PrismicHeading,
    getText,
} from 'utils/prismic';

import { AliasSelectMapperType } from 'utils/mapping';
import React from 'react';
import { BgMode } from '@blateral/b.kit/lib/components/base/Section';
import { DynamicForm } from '@blateral/b.kit';

export interface FormStructure {
    [key: string]:
        | FieldSlice
        | AreaSlice
        | SelectSlice
        | DatepickerSlice
        | FieldGroupSlice
        | FileUploadSlice;
}

export interface FormField {
    isRequired?: PrismicBoolean;
}

export interface FormData {
    [key: string]:
        | string
        | boolean
        | Array<string>
        | [Date | null, Date | null]
        | Array<File>;
}

export interface FormField {
    slice_type?:
        | 'Field'
        | 'Area'
        | 'Datepicker'
        | 'FieldGroup'
        | 'Select'
        | 'Upload';
}

export interface FieldSlice extends FormField {
    slice_type: 'Field';
    primary?: {
        field_name?: PrismicKeyText;
        input_type?: 'Text' | 'Nummer' | 'Email' | 'Passwort' | 'Telefon';
        inital_value?: PrismicKeyText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
        icon?: PrismicImage;
        is_required?: PrismicBoolean;
    };
    validate?: (value: string, config: FieldSlice) => Promise<string>;
    errorMsg?: string;
}

export interface AreaSlice extends FormField {
    slice_type: 'Area';
    primary?: {
        field_name?: string;
        inital_value?: PrismicRichText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
        is_required?: PrismicBoolean;
    };
    validate?: (value: string, config: AreaSlice) => Promise<string>;
    errorMsg?: string;
}

export interface SelectSlice extends FormField {
    slice_type: 'Select';
    primary?: {
        field_name?: PrismicHeading;
        inital_value?: PrismicKeyText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
        icon?: PrismicImage;
        is_required?: boolean;
    };
    validate?: (value: string, config: SelectSlice) => Promise<string>;
    errorMsg?: string;
    items: {
        value?: PrismicKeyText;
        label?: PrismicKeyText;
    }[];
}

export interface DatepickerSlice extends FormField {
    slice_type: 'Datepicker';
    primary?: {
        field_name?: PrismicKeyText;
        initialDates?: [Date, Date];
        placeholder?: PrismicKeyText;
        minDate?: Date;
        maxDate?: Date;
        singleSelect?: PrismicBoolean;
        icon?: PrismicImage;
        info?: PrismicKeyText;
    };
    singleDateError?: string;
    mutliDateError?: string;
    nextCtrlUrl?: string;
    prevCtrlUrl?: string;
    validate?: (
        value: [Date | null, Date | null],
        config: DatepickerSlice
    ) => Promise<string>;
    deleteAction?: (
        handleClick: (e: React.SyntheticEvent<HTMLButtonElement, Event>) => void
    ) => React.ReactNode;
    submitAction?: (
        handleClick?: (
            e: React.SyntheticEvent<HTMLButtonElement, Event>
        ) => void
    ) => React.ReactNode;
}

export interface FieldGroupSlice extends FormField {
    slice_type: 'FieldGroup';
    primary?: {
        group_type: 'Radio' | 'Checkbox';
        field_name?: PrismicHeading;
        is_required?: PrismicBoolean;
    };
    items?: Array<{ initialChecked?: PrismicBoolean; text?: PrismicKeyText }>;
    validate?: (
        value: Array<string> | string,
        config: FieldGroupSlice
    ) => Promise<string>;
    errorMsg?: string;
}

export interface FileUploadSlice extends FormField {
    slice_type: 'Upload';
    primary?: {
        is_required?: PrismicBoolean;
        field_name?: PrismicHeading;
        add_btn_label?: PrismicKeyText;
        remove_btn_label?: PrismicKeyText;
        info?: PrismicKeyText;
        accepted_formats?: PrismicKeyText;
    };
    validate?: (value: Array<File>, config: FileUploadSlice) => Promise<string>;
    errorMsg?: string;
}

export interface DynamicFormSliceType
    extends PrismicSlice<'DynamicForm', FormField> {
    onSubmit?: (values: FormData) => Promise<void>;

    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        submit_label?: PrismicKeyText;
        bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
        dynamic_form?: DynamicFormDataPage;
    };
}

export const DynamicFormSlice: React.FC<DynamicFormSliceType> = ({
    onSubmit,
    primary: { submit_label },
    items,
}) => {
    let fieldObject = {};

    items.forEach((formfield) => {
        switch (formfield.slice_type) {
            case 'Field':
                fieldObject = {
                    ...fieldObject,
                    ...generateTextField(formfield as FieldSlice),
                };
                break;
            case 'Area':
                fieldObject = {
                    ...fieldObject,
                    ...generateTextArea(formfield as AreaSlice),
                };
                break;
            case 'FieldGroup':
                fieldObject = {
                    ...fieldObject,
                    ...generateFieldGroup(formfield as FieldGroupSlice),
                };
                break;
            case 'Select':
                fieldObject = {
                    ...fieldObject,
                    ...generateSelect(formfield as SelectSlice),
                };
                break;
            case 'Upload':
                fieldObject = {
                    ...fieldObject,
                    ...generateUpload(formfield as FileUploadSlice),
                };
                break;
            case 'Datepicker':
                fieldObject = {
                    ...fieldObject,
                    ...generateDatepicker(formfield as DatepickerSlice),
                };
        }
    });
    return (
        <DynamicForm
            onSubmit={onSubmit}
            submitLabel={submit_label || 'senden'}
            fields={fieldObject}
        />
    );
};

const generateTextField = (formfield?: FieldSlice) => {
    if (!formfield?.primary?.field_name) return null;

    const prismicSelectMap = {
        Text: 'text',
        Nummer: 'number',
        Email: 'email',
        Passwort: 'password',
        Telefon: 'tel',
    };

    const textFormField = {};
    const fieldName = getText(formfield.primary.field_name);

    textFormField[fieldName] = {
        type: 'Field',
        inputType: prismicSelectMap[formfield?.primary.input_type || 'Text'],
        placeholder: formfield?.primary.placeholder || '',
        isRequired: formfield?.primary.is_required || false,
        info: formfield?.primary.info,
        icon: { src: formfield?.primary.icon?.url || '' },
        validate: formfield.validate,
    };

    return textFormField;
};

const generateTextArea = (formfield?: AreaSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const textArea = {};
    const fieldName = getText(formfield.primary.field_name);

    textArea[fieldName] = {
        type: 'Area',
        placeholder: formfield?.primary.placeholder || '',
        isRequired: formfield?.primary.is_required || false,
        info: formfield?.primary.info,
    };

    return textArea;
};

const generateFieldGroup = (formfield?: FieldGroupSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const fieldGroup = {};
    const fieldName = getText(formfield.primary.field_name);

    fieldGroup[fieldName] = {
        type: 'FieldGroup',
        groupType: formfield.primary.group_type || 'Checkbox',
        isRequired: formfield?.primary.is_required || false,
        fields: formfield?.items?.map((item) => {
            return {
                text: item.text || '',
                initialChecked: item.initialChecked || false,
            };
        }),
    };

    return fieldGroup;
};

const generateSelect = (formfield?: SelectSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Select',
        initalValue: formfield?.primary?.inital_value || undefined,
        isRequired: formfield.isRequired,
        dropdownItems: formfield.items.map((item) => {
            return {
                label: item.label || '',
                value: item.value || '',
            };
        }),
        icon: { src: formfield.primary.icon?.url || '' },
    };

    return selectField;
};

const generateUpload = (formfield?: FileUploadSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Upload',
        isRequired: formfield.isRequired,
        addBtnLabel: formfield.primary.add_btn_label || '',
        removeBtnLabel: formfield.primary.remove_btn_label || '',
        acceptedFormats: formfield.primary.accepted_formats || '',
    };

    return selectField;
};

const generateDatepicker = (formfield?: DatepickerSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Datepicker',
        isRequired: formfield.isRequired,
        info: formfield?.primary?.info || '',
        placeholder: formfield?.primary.placeholder || '',
        icon: { src: formfield.primary.icon || '' },
    };

    return selectField;
};
