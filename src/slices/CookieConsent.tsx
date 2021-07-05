import {
    getHtmlText,
    getText,
    isRichTextEmpty,
    PrismicImage,
    PrismicKeyText,
    PrismicRichText,
} from '../utils/prismic';

import {
    CookieActions,
    CookieConsent,
    CookieIcon,
    CookieText,
    CookieTitle,
} from '@blateral/b.kit';
import React from 'react';

export interface CookieConsentSliceType {
    icon?: PrismicImage;
    title?: PrismicRichText;
    text?: PrismicRichText;
    acceptCtaLabel?: PrismicKeyText;
    declineCtaLabel?: PrismicKeyText;

    // helpers to define component elements outside of slice
    cookieName?: string;
    urlWhitelist?: string[];
    consentAcceptStatusMsg?: string;
    consentDeclineStatusMsg?: string;
    noCookieStatusMsg?: string;
    dateFormat?: string;
    timeFormat?: string;
    lifetime?: number;
    localeKey?: 'de' | 'eng';
    zIndex?: number;
    overlayOpacity?: number;
    acceptAction?: (props: {
        handleAccept: () => void;
        additionalAcceptProps: {
            ['data-gtm']: string;
        };
        label?: string;
    }) => React.ReactNode;
    declineAction?: (props: {
        handleDecline: () => void;
        label?: string;
        additionalDeclineProps: {
            ['data-gtm']: string;
        };
    }) => React.ReactNode;
}

export const CookieConsentSlice: React.FC<CookieConsentSliceType> = ({
    icon,
    title,
    text,
    acceptCtaLabel,
    declineCtaLabel,
    acceptAction,
    declineAction,
    ...rest
}) => {
    // FIXME: Locale key 'eng' not compatible with 'en'
    return (
        <CookieConsent {...{ ...rest, localeKey: "de" }}>
            {({
                handleAccept,
                handleDecline,
                additionalAcceptProps,
                additionalDeclineProps,
            }) => (
                <>
                    {icon?.url && (
                        <CookieIcon src={icon?.url} alt={icon?.alt} />
                    )}
                    {title && !isRichTextEmpty(title) && (
                        <CookieTitle innerHTML={getHtmlText(title)} />
                    )}
                    {text && !isRichTextEmpty(text) && (
                        <CookieText innerHTML={getHtmlText(text)} />
                    )}
                    {(acceptAction || declineAction) && (
                        <CookieActions
                            primary={
                                acceptAction &&
                                acceptCtaLabel &&
                                acceptAction({
                                    handleAccept,
                                    additionalAcceptProps,
                                    label: getText(acceptCtaLabel),
                                })
                            }
                            secondary={
                                declineAction &&
                                declineCtaLabel &&
                                declineAction({
                                    handleDecline,
                                    additionalDeclineProps,
                                    label: getText(declineCtaLabel),
                                })
                            }
                        />
                    )}
                </>
            )}
        </CookieConsent>
    );
};
