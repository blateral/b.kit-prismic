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
} from '../../utils/prismic';

import { AliasSelectMapperType } from '../../utils/mapping';
import { NewsTable } from '@blateral/b.kit';
import React from 'react';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';



interface TableItem {
    table_title?: PrismicKeyText;
    table?: PrismicRichText;
}
type BgMode =
    | 'full'
    | 'half-left'
    | 'half-right'
    | 'larger-left'
    | 'larger-right';

export interface NewsTableSliceType extends PrismicSlice<'NewsTable', TableItem> {
    primary: {
        is_active?: PrismicBoolean;
        title?: PrismicHeading;
        table?: PrismicRichText;
        is_inverted?: PrismicBoolean;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    primary: {
        is_inverted,
        primary_label,
        secondary_label,
        primary_link,
        secondary_link,
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    return (
        <NewsTable
            tableItems={createTableItems(items)}
            isInverted={is_inverted}
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
        />
    );
};



function createTableItems(tableItems: TableItem[]): TableProps[] {
    return tableItems.filter(item => item.table && item.table.length > 0).map(item => {
        const { tableHeaders, sliceRows } = convertCsvToTable(getText(item.table!));

        return {
            tableTitle: item.table_title || "",
            rowTitle: tableHeaders || [],
            row: sliceRows || []

        }
    })

}


function convertCsvToTable(tableCsv: string) {

    const rows = tableCsv.split("\n");
    const tableHeaders = rows[0].split(",");

    const sliceRows = rows.map((row) => {
        const columns = row.split(",");
        return {
            cols: columns
        }
    })


    sliceRows.shift();

    return { tableHeaders, sliceRows }
}
