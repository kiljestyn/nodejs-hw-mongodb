const parseNumber = (unknown, defaultNumber) => {
  if (typeof unknown !== 'string') return defaultNumber;

  const parsedNumber = parseInt(unknown);

  if (Number.isNaN(parsedNumber)) return defaultNumber;

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
