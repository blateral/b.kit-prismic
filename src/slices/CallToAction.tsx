import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    isPrismicLinkExternal,
    resolveUnknownLink,
    getText,
    getHtmlText,
    getHeadlineTag,
    PrismicImage,
    isValidAction,
} from 'utils/prismic';

import React, { useContext } from 'react';
import { CallToAction } from '@blateral/b.kit';
import { PrismicContext } from 'utils/settings';

interface AddressSliceType {
    decorator?: PrismicImage;
    label?: PrismicRichText;
}

export interface CallToActionSliceType
    extends PrismicSlice<
        'CallToAction' | 'CallToActionNewsletter',
        AddressSliceType
    > {
    primary: {
        is_active?: PrismicBoolean;
        is_inverted?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;

        contact_avatar?: PrismicImage;
        contact_name?: PrismicKeyText;
        contact_description?: PrismicKeyText;

        newsletter_placeholder?: PrismicKeyText;
        newsletter_button_label?: PrismicKeyText;

        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;

        badge?: PrismicImage;
    };
    // helpers to define component elements outside of slice
    injectForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonLabel?: string;
    }) => React.ReactNode;
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
}

export const CallToActionSlice: React.FC<CallToActionSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        is_inverted,

        contact_avatar,
        contact_name,
        contact_description,

        newsletter_placeholder,
        newsletter_button_label,

        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
        badge,
    },
    items,
    injectForm,
    primaryAction,
    secondaryAction,
}) => {
    const settingsCtx = useContext(PrismicContext);

    return (
        <CallToAction
            isInverted={is_inverted}
            title={getText(title)}
            titleAs={getHeadlineTag(title)}
            superTitle={getText(super_title)}
            superTitleAs={getHeadlineTag(super_title)}
            text={getHtmlText(text)}
            contact={
                contact_name && contact_avatar?.url
                    ? {
                          avatar: contact_avatar?.url
                              ? {
                                    src: contact_avatar?.url,
                                    alt: contact_avatar?.alt || '',
                                }
                              : undefined,
                          name: getText(contact_name),
                          description: getText(contact_description),
                          addresses: items.map((item) => {
                              return {
                                  decorator: item?.decorator?.url && (
                                      <img
                                          src={item?.decorator?.url}
                                          alt={item?.decorator?.alt}
                                      />
                                  ),
                                  label: getHtmlText(item?.label),
                              };
                          }),
                      }
                    : undefined
            }
            newsForm={
                newsletter_placeholder || newsletter_button_label
                    ? (isInverted?: boolean) =>
                          injectForm &&
                          injectForm({
                              isInverted,
                              buttonLabel: getText(newsletter_button_label),
                              placeholder: getText(newsletter_placeholder),
                          })
                    : undefined
            }
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href:
                                  resolveUnknownLink(
                                      primary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
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
                              href:
                                  resolveUnknownLink(
                                      secondary_link,
                                      settingsCtx?.linkResolver
                                  ) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
            badge={
                badge?.url && (
                    <img
                        src={badge?.url}
                        alt={badge?.alt || ''}
                        style={{ height: '100%', width: '100%' }}
                    />
                )
            }
        />
    );
};
