export type Pagination = {
    total_record: number;
    limit_records: number;

    current_page: number;
    total_pages: number;

    next_page?: number;
    prev_page?: number;
};

export type HTTPResponse<T> = {
    message: string;
    success: boolean;
    data?: T;
    timestamp: string;
    pagination?: Pagination;
};

export function newSuccessResponse<T>(
    data: T,
    message?: string,
    pagination?: Pagination,
): HTTPResponse<T> {
    return {
        message: message || 'Success',
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
        pagination,
    };
}

export type HTTPErrorResponse<T> = {
    message: string;
    success: boolean;
    code?: string;
    details?: T;
    path?: string;
    timestamp: string;
};

export function newPagination(
    totalAllRecords: number,
    totalRecords: number,
    limitRecords: number,
    currentPage: number,
): Pagination {
    const totalPages = Math.ceil(totalAllRecords / limitRecords);

    let nextPage: number | undefined;
    let prevPage: number | undefined;

    if (currentPage > 1) {
        prevPage = currentPage - 1;
    }

    if (currentPage < totalPages) {
        nextPage = currentPage + 1;
    }

    return {
        total_record: totalRecords,
        limit_records: limitRecords,
        current_page: currentPage,
        total_pages: totalPages,
        next_page: nextPage,
        prev_page: prevPage,
    };
}
