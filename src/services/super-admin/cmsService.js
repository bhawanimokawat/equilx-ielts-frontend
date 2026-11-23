import api from "../../api/axiosInstance";

const BASE_URL = "/cms";

// Books
const createBook = async (data) => {
  const response = await api.post(`${BASE_URL}/books`, data);
  return response.data;
};

const getBooks = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/books`, { params });
  return response.data;
};

const getBookById = async (bookId) => {
  const response = await api.get(`${BASE_URL}/books/${bookId}`);
  return response.data;
};

const updateBook = async (bookId, data) => {
  const response = await api.patch(`${BASE_URL}/books/${bookId}`, data);
  return response.data;
};

// Tests
const createTest = async (bookId, data) => {
  const response = await api.post(`${BASE_URL}/books/${bookId}/tests`, data);
  return response.data;
};

const getTests = async (bookId, params = {}) => {
  const response = await api.get(`${BASE_URL}/books/${bookId}/tests`, {
    params,
  });
  return response.data;
};

const getTestById = async (testId) => {
  const response = await api.get(`${BASE_URL}/tests/${testId}`);
  return response.data;
};

const updateTest = async (testId, data) => {
  const response = await api.patch(`${BASE_URL}/tests/${testId}`, data);
  return response.data;
};

const archiveTest = async (testId) => {
  const response = await api.patch(`${BASE_URL}/tests/${testId}/archive`);
  return response.data;
};

// Test Versions
const createTestVersion = async (testId) => {
  const response = await api.post(`${BASE_URL}/tests/${testId}/versions`);
  return response.data;
};

const getTestVersionById = async (versionId) => {
  const response = await api.get(`${BASE_URL}/test-versions/${versionId}`);
  return response.data;
};

const updateTestVersion = async (versionId, data) => {
  const response = await api.patch(
    `${BASE_URL}/test-versions/${versionId}`,
    data
  );
  return response.data;
};

const validateTestVersion = async (versionId) => {
  const response = await api.post(
    `${BASE_URL}/test-versions/${versionId}/validate`
  );
  return response.data;
};

const publishTestVersion = async (versionId) => {
  const response = await api.post(
    `${BASE_URL}/test-versions/${versionId}/publish`
  );
  return response.data;
};

// Test Modules
const createTestModule = async (data) => {
  const response = await api.post(`${BASE_URL}/test-modules`, data);
  return response.data;
};

const getTestModuleById = async (moduleId) => {
  const response = await api.get(`${BASE_URL}/test-modules/${moduleId}`);
  return response.data;
};

const updateTestModule = async (moduleId, data) => {
  const response = await api.patch(
    `${BASE_URL}/test-modules/${moduleId}`,
    data
  );
  return response.data;
};

// Test Parts
const createTestPart = async (data) => {
  const response = await api.post(`${BASE_URL}/test-parts`, data);
  return response.data;
};

const getTestPartById = async (partId) => {
  const response = await api.get(`${BASE_URL}/test-parts/${partId}`);
  return response.data;
};

const updateTestPart = async (partId, data) => {
  const response = await api.patch(`${BASE_URL}/test-parts/${partId}`, data);
  return response.data;
};

// Question Groups
const createQuestionGroup = async (data) => {
  const response = await api.post(`${BASE_URL}/question-groups`, data);
  return response.data;
};

const getQuestionGroupById = async (groupId) => {
  const response = await api.get(`${BASE_URL}/question-groups/${groupId}`);
  return response.data;
};

const updateQuestionGroup = async (groupId, data) => {
  const response = await api.patch(
    `${BASE_URL}/question-groups/${groupId}`,
    data
  );
  return response.data;
};

// Questions
const createQuestion = async (data) => {
  const response = await api.post(`${BASE_URL}/questions`, data);
  return response.data;
};

const getQuestionById = async (questionId) => {
  const response = await api.get(`${BASE_URL}/questions/${questionId}`);
  return response.data;
};

const updateQuestion = async (questionId, data) => {
  const response = await api.patch(
    `${BASE_URL}/questions/${questionId}`,
    data
  );
  return response.data;
};

// Answer Keys
const createAnswerKey = async (data) => {
  const response = await api.post(`${BASE_URL}/answer-keys`, data);
  return response.data;
};

const getAnswerKeyById = async (answerKeyId) => {
  const response = await api.get(`${BASE_URL}/answer-keys/${answerKeyId}`);
  return response.data;
};

const updateAnswerKey = async (answerKeyId, data) => {
  const response = await api.patch(
    `${BASE_URL}/answer-keys/${answerKeyId}`,
    data
  );
  return response.data;
};

// Band Conversions
const createBandConversion = async (data) => {
  const response = await api.post(`${BASE_URL}/band-conversions`, data);
  return response.data;
};

const getBandConversionById = async (conversionId) => {
  const response = await api.get(
    `${BASE_URL}/band-conversions/${conversionId}`
  );
  return response.data;
};

// Bulk Import
const bulkImportTest = async (data) => {
  const response = await api.post(`${BASE_URL}/bulk-import`, data);
  return response.data;
};

const cmsService = {
  createBook,
  getBooks,
  getBookById,
  updateBook,

  createTest,
  getTests,
  getTestById,
  updateTest,
  archiveTest,

  createTestVersion,
  getTestVersionById,
  updateTestVersion,
  validateTestVersion,
  publishTestVersion,

  createTestModule,
  getTestModuleById,
  updateTestModule,

  createTestPart,
  getTestPartById,
  updateTestPart,

  createQuestionGroup,
  getQuestionGroupById,
  updateQuestionGroup,

  createQuestion,
  getQuestionById,
  updateQuestion,

  createAnswerKey,
  getAnswerKeyById,
  updateAnswerKey,

  createBandConversion,
  getBandConversionById,

  bulkImportTest,
};

export default cmsService;
