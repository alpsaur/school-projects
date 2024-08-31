// Helper function to format GraphQL error responses
const formatGraphQLError = (message, error) => ({
  success: false,
  message,
  details: error ? error.message : null,
});

export { formatGraphQLError };
