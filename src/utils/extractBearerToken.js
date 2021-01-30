const extractBearerToken = (headerValue) => {
  if (typeof headerValue !== 'string') {
    return false;
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i);

  return matches && matches[2];
};

module.exports = extractBearerToken;
