import {
    PrismicKeyText,
    PrismicRichText,
    PrismicSlice,
    PrismicBoolean,
    PrismicImage,
    DynamicFormDataPage,
    PrismicHeading,
    getText,
    PrismicSelectField,
    mapPrismicSelect,
    PrismicLink,
} from 'utils/prismic';

import { AliasSelectMapperType } from 'utils/mapping';
import React from 'react';
import { DynamicForm } from '@blateral/b.kit';
import {
    Area,
    Datepicker,
    Field,
    FieldGenerationProps,
    FieldGroup,
    FileUpload,
    Select,
} from '@blateral/b.kit/lib/components/sections/DynamicForm';

type BgMode = 'full' | 'inverted';

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
    primary?: PrimaryData;
    items?: any[];
}

export interface PrimaryData {
    column?: 'Links' | 'Rechts' | 'Einspaltig';
    field_name?: PrismicKeyText;
    is_required?: PrismicBoolean;
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
    primary?: PrimaryData & {
        input_type?: 'Text' | 'Nummer' | 'Email' | 'Passwort' | 'Telefon';
        inital_value?: PrismicKeyText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
        icon?: PrismicImage;
    };
    validate?: (value: string, config: FieldSlice) => Promise<string>;
    errorMsg?: string;
}

export interface AreaSlice extends FormField {
    slice_type: 'Area';
    primary?: PrimaryData & {
        inital_value?: PrismicRichText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
    };
    validate?: (value: string, config: AreaSlice) => Promise<string>;
    errorMsg?: string;
}

export interface SelectSlice extends FormField {
    slice_type: 'Select';
    primary?: PrimaryData & {
        inital_value?: PrismicKeyText;
        placeholder?: PrismicKeyText;
        info?: PrismicKeyText;
        icon?: PrismicImage;
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
    primary?: PrimaryData & {
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
    primary?: PrimaryData & {
        group_type: 'Radio' | 'Checkbox';
        field_name?: PrismicHeading;
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
    primary?: PrimaryData & {
        field_name?: PrismicHeading;
        add_btn_label?: PrismicKeyText;
        remove_btn_label?: PrismicKeyText;
        info?: PrismicKeyText;
        accepted_formats?: PrismicKeyText;

        submit_label?: PrismicKeyText;

        subject_text?: PrismicKeyText;
        redirect_url?: PrismicLink;
        target_mails?: PrismicKeyText;
    };
    validate?: (value: Array<File>, config: FileUploadSlice) => Promise<string>;
    errorMsg?: string;
}

export interface DynamicFormSliceType
    extends PrismicSlice<'DynamicForm', FormField> {
    onSubmit?: (values: FormData) => Promise<void>;
    definitions?: {
        field?: (props: FieldGenerationProps<Field>) => React.ReactNode;
        area?: (props: FieldGenerationProps<Area>) => React.ReactNode;
        select?: (props: FieldGenerationProps<Select>) => React.ReactNode;
        datepicker?: (
            props: FieldGenerationProps<Datepicker>
        ) => React.ReactNode;
        checkbox?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        radio?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        upload?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
    };
    submitAction?: (props: {
        label?: string;
        isInverted?: boolean;
        handleSubmit?: () => Promise<any>;
        isDisabled?: boolean;
    }) => React.ReactNode;
    onField?: (field: FormField) => FormField;

    primary: {
        bg_mode?: PrismicSelectField;
        is_active?: PrismicBoolean;
        submit_label?: PrismicKeyText;
        dynamic_form?: DynamicFormDataPage;
    };

    // helpers to define elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const DynamicFormSlice: React.FC<DynamicFormSliceType> = ({
    onSubmit,
    definitions,
    submitAction,
    onField,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },

    primary: { submit_label, bg_mode },
    items,
}) => {
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);
    let fieldObject = {};

    items.forEach((formfield) => {
        switch (formfield.slice_type) {
            case 'Field':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateTextField(formfield as FieldSlice),
                };
                break;
            case 'Area':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateTextArea(formfield as AreaSlice),
                };
                break;
            case 'FieldGroup':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateFieldGroup(formfield as FieldGroupSlice),
                };
                break;
            case 'Select':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateSelect(formfield as SelectSlice),
                };
                break;
            case 'Upload':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateUpload(formfield as FileUploadSlice),
                };
                break;
            case 'Datepicker':
                if (onField) formfield = onField(formfield);
                fieldObject = {
                    ...fieldObject,
                    ...generateDatepicker(formfield as DatepickerSlice),
                };
        }
    });
    return (
        <DynamicForm
            onSubmit={onSubmit}
            definitions={definitions}
            bgMode={bgMode}
            submitAction={
                submitAction
                    ? ({ isInverted, handleSubmit, isDisabled }) =>
                          submitAction({
                              isInverted,
                              handleSubmit,
                              isDisabled,
                              label: submit_label
                                  ? getText(submit_label)
                                  : 'senden',
                          })
                    : undefined
            }
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
        column:
            formfield?.primary?.column === 'Rechts'
                ? 'right'
                : formfield.primary.column === 'Links'
                ? 'left'
                : undefined,
        inputType: prismicSelectMap[formfield?.primary.input_type || 'Text'],
        placeholder: formfield?.primary.placeholder || '',
        isRequired: formfield?.primary.is_required || false,
        info: formfield?.primary.info,
        icon: { src: formfield?.primary.icon?.url || '' },
        validate: formfield.validate,
        errorMsg: formfield?.errorMsg,
    } as Field;

    return textFormField;
};

const generateTextArea = (formfield?: AreaSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const textArea = {};
    const fieldName = getText(formfield.primary.field_name);

    textArea[fieldName] = {
        type: 'Area',
        column:
            formfield?.primary?.column === 'Rechts'
                ? 'right'
                : formfield.primary.column === 'Links'
                ? 'left'
                : undefined,
        placeholder: formfield?.primary.placeholder || '',
        isRequired: formfield?.primary.is_required || false,
        info: formfield?.primary.info,
        errorMsg: formfield?.errorMsg,
    } as Area;

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
        errorMsg: formfield?.errorMsg,
    } as FieldGroup;

    return fieldGroup;
};

const generateSelect = (formfield?: SelectSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Select',
        initalValue: formfield?.primary?.inital_value || undefined,
        isRequired: formfield.primary.is_required,
        dropdownItems: formfield.items.map((item) => {
            return {
                label: item.label || '',
                value: item.value || '',
            };
        }),
        icon: { src: formfield.primary.icon?.url || '' },
        errorMsg: formfield?.errorMsg,
    } as Select;

    return selectField;
};

const generateUpload = (formfield?: FileUploadSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Upload',
        isRequired: formfield.primary.is_required,
        addBtnLabel: formfield.primary.add_btn_label || '',
        removeBtnLabel: formfield.primary.remove_btn_label || '',
        acceptedFormats: formfield.primary.accepted_formats || '',
        errorMsg: formfield?.errorMsg,
    } as FileUpload;

    return selectField;
};

const generateDatepicker = (formfield?: DatepickerSlice) => {
    if (!formfield?.primary?.field_name) return null;
    const selectField = {};
    const fieldName = getText(formfield.primary.field_name);

    selectField[fieldName] = {
        type: 'Datepicker',
        isRequired: formfield.primary.is_required,
        info: formfield?.primary?.info || '',
        placeholder: formfield?.primary.placeholder || '',
        icon: { src: formfield.primary.icon || '' },
        mutliDateError: formfield?.mutliDateError,
        singleDateError: formfield?.singleDateError,
    } as Datepicker;

    return selectField;
};
