import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    getText,
} from 'utils/prismic';

import { NewsTable } from '@blateral/b.kit';
import React from 'react';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';

export interface NewsTableSliceType extends PrismicSlice<'NewsTable'> {
    primary: {
        is_active?: PrismicBoolean;
        has_back?: PrismicBoolean;
        table_title?: PrismicHeading;
        table?: PrismicRichText;
        as_table_header?: PrismicBoolean;
    };
}

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    primary: { has_back, table_title, table, as_table_header },
}) => {
    return (
        <NewsTable
            hasBack={has_back}
            tableItems={[
                createTableItem(
                    getText(table),
                    getText(table_title),
                    as_table_header
                ),
            ]}
        />
    );
};

function createTableItem(
    tableItem: string,
    tableTitle?: string,
    firstRowAsHeadings?: boolean
): TableProps {
    if (!tableItem) return { row: [], rowTitle: [] };

    const { tableHeaders, sliceRows } = convertCsvToTable(
        getText(tableItem),
        firstRowAsHeadings
    );

    return {
        tableTitle: tableTitle,
        rowTitle: tableHeaders || [],
        row: sliceRows || [],
    };
}

function convertCsvToTable(tableCsv: string, firstRowAsHeading = false) {
    const rows = tableCsv.split('\n');

    const sliceRows = rows.map((row) => {
        const columns = row.split(',');
        return {
            cols: columns,
        };
    });

    if (firstRowAsHeading) {
        const tableHeaders = rows[0].split(',');
        sliceRows.shift();

        return { tableHeaders, sliceRows };
    }

    return { sliceRows };
}
