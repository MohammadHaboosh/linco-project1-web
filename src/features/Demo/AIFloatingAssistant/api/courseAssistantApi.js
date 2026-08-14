import { apiFetch } from "../../../../api/apiFetch";

const stripOptionPrefix = (option) =>
  String(option ?? "")
    .replace(/^\s*[A-Z]\s*[).:-]\s*/i, "")
    .trim();

const findCorrectOptionIndex = (correctAnswer, options) => {
  const normalizedAnswer = String(correctAnswer ?? "").trim();
  const letterMatch = normalizedAnswer.match(/^([A-Z])(?:\s*[).:-])?$/i);

  if (letterMatch) {
    const optionIndex = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (optionIndex >= 0 && optionIndex < options.length) return optionIndex;
  }

  const answerWithoutPrefix = stripOptionPrefix(normalizedAnswer).toLowerCase();
  return options.findIndex(
    (option) => stripOptionPrefix(option).toLowerCase() === answerWithoutPrefix,
  );
};

const normalizeQuizQuestions = (questions) =>
  questions.map((item, index) => {
    const question = String(item?.question ?? "").trim();
    const options = Array.isArray(item?.options)
      ? item.options
          .map((option) => String(option ?? "").trim())
          .filter(Boolean)
      : [];
    const correctOptionIndex = findCorrectOptionIndex(
      item?.correct_answer,
      options,
    );

    if (!question || options.length < 2 || correctOptionIndex < 0) {
      throw new Error(`Generated quiz question ${index + 1} is invalid.`);
    }

    return {
      id: `generated-question-${index}`,
      question,
      options,
      correctOptionIndex,
      explanation: String(item?.explanation ?? "").trim(),
    };
  });

const normalizeQuestionCount = (questionCount) => {
  const normalizedQuestionCount = Number(questionCount);

  if (
    !Number.isInteger(normalizedQuestionCount) ||
    normalizedQuestionCount < 1
  ) {
    throw new Error("Question count must be a positive whole number.");
  }

  return normalizedQuestionCount;
};

const requestGeneratedQuiz = async (
  courseId,
  endpoint,
  payload,
  options,
  failureMessage,
) => {
  if (!courseId) {
    throw new Error("A course is required before generating a quiz.");
  }

  const response = await apiFetch(
    `/courses/${encodeURIComponent(courseId)}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    },
  );

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok || responseData.success === false) {
    throw new Error(responseData.message || failureMessage);
  }

  if (!Array.isArray(responseData.data) || responseData.data.length === 0) {
    throw new Error("The generated quiz did not contain any questions.");
  }

  return normalizeQuizQuestions(responseData.data);
};

export const courseAssistantApi = {
  askQuestion: async (courseId, question, options = {}) => {
    const normalizedQuestion = String(question ?? "").trim();

    if (!courseId) {
      throw new Error("A course is required before asking a question.");
    }

    if (!normalizedQuestion) {
      throw new Error("Enter a question to ask the course assistant.");
    }

    const response = await apiFetch(
      `/courses/${encodeURIComponent(courseId)}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: normalizedQuestion }),
        signal: options.signal,
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || responseData.success === false) {
      throw new Error(
        responseData.message ||
          "The course assistant could not answer right now.",
      );
    }

    if (typeof responseData.data !== "string" || !responseData.data.trim()) {
      throw new Error("The course assistant returned an invalid response.");
    }

    return responseData.data.trim();
  },

  generateTopicQuiz: async (
    courseId,
    { topic, questionCount },
    options = {},
  ) => {
    const normalizedTopic = String(topic ?? "").trim();

    if (!normalizedTopic) {
      throw new Error("Enter a topic for the quiz.");
    }

    return requestGeneratedQuiz(
      courseId,
      "quiz/generate",
      {
        topic: normalizedTopic,
        questionCount: normalizeQuestionCount(questionCount),
      },
      options,
      "The topic quiz could not be generated.",
    );
  },

  generateRandomQuiz: async (courseId, questionCount, options = {}) => {
    return requestGeneratedQuiz(
      courseId,
      "random-quiz/generate",
      { questionCount: normalizeQuestionCount(questionCount) },
      options,
      "The random quiz could not be generated.",
    );
  },
};
