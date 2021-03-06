import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    resolveUnknownLink,
} from '../utils/prismic';

import React from 'react';
import { Table } from '@blateral/b.kit';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table'

interface TableItem {
    table_title?: PrismicKeyText;
    table?: PrismicRichText;
}
export interface TableSliceType extends PrismicSlice<'Table', TableItem> {
    primary: {
        is_active?: PrismicBoolean;


        is_inverted?: PrismicBoolean;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
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
}



export const TableSlice: React.FC<TableSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        primary_label,
        secondary_label,
        primary_link,
        secondary_link,
    },
    items,
    primaryAction,
    secondaryAction,
}) => {
    const tableData = createTableItems(items)

    return <Table
        title={getText(title) || ""}
        titleAs={getHeadlineTag(title) || "div"}
        superTitle={getText(super_title) || ""}
        superTitleAs={getHeadlineTag(super_title) || "div"}
        text={getHtmlText(text) || ""}
        tableItems={tableData}



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
