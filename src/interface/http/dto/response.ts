export type HTTPResponse<T> = {
    message: string;
    success: boolean;
    data?: T;
    timestamp: string;
};

export type HTTPErrorResponse<T> = {
    message: string;
    success: boolean;
    code?: string;
    details?: T;
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
