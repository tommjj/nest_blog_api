export type ParseResult<T> =
    | {
          v: T;
          ok: true;
      }
    | {
          v: undefined;
          ok: false;
      };
