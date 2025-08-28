type WithErrorResult<T> =
    | {
          data: undefined;
          error: unknown;
          ok: false;
      }
    | {
          data: T;
          error: undefined;
          ok: true;
      };

export async function withError<T>(
    promise: Promise<T>,
): Promise<WithErrorResult<T>> {
    try {
        const data = await promise;
        return { data, error: undefined, ok: true };
    } catch (error: unknown) {
        return { data: undefined, error: error, ok: false };
    }
}
