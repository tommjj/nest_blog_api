type ResponseType<T> = {
    success: boolean;
    data: T;
    message?: string;
};

export default ResponseType;
