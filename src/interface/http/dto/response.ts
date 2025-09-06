export type HTTPResponse<T> = {
    message: string;
    success: boolean;
    data?: T;
    timestamp: string;
};

export function newSuccessResponse<T>(
    data: T,
    message?: string,
): HTTPResponse<T> {
    return {
        message: message || 'Success',
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
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
