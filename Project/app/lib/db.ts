// Mô phỏng database lưu trữ dữ liệu phỏng vấn
// Trong thực tế, điều này sẽ được thay thế bằng một cơ sở dữ liệu thực như MongoDB hoặc PostgreSQL

interface InterviewSession {
  sessionId: string;
  name: string;
  topic: string;
  position: string;
  questions: string[];
  answers: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Đối tượng lưu trữ tất cả các phiên phỏng vấn, key là sessionId
let interviewSessions: Record<string, InterviewSession> = {};

// Hàm lưu sessions vào localStorage (client-side)
const saveSessionsToStorage = () => {
  if (typeof window === "undefined") return;

  try {
    // Chuyển đổi Date thành string để không mất dữ liệu khi stringify
    const sessionsToSave = Object.entries(interviewSessions).reduce(
      (acc, [key, session]) => {
        acc[key] = {
          ...session,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        };
        return acc;
      },
      {} as Record<string, any>
    );

    localStorage.setItem("interviewSessions", JSON.stringify(sessionsToSave));
    console.log("Đã lưu phiên phỏng vấn vào localStorage");
  } catch (e) {
    console.error("Lỗi khi lưu phiên phỏng vấn vào localStorage:", e);
  }
};

// Hàm khôi phục sessions từ localStorage (client-side)
const loadSessionsFromStorage = () => {
  if (typeof window === "undefined") return;

  try {
    const sessionsJson = localStorage.getItem("interviewSessions");
    if (!sessionsJson) {
      console.log("Không có dữ liệu phiên phỏng vấn trong localStorage");
      return;
    }

    const sessions = JSON.parse(sessionsJson);

    // Chuyển đổi string thành Date objects
    interviewSessions = Object.entries(sessions).reduce(
      (acc, [key, session]) => {
        acc[key] = {
          ...(session as any),
          createdAt: new Date((session as any).createdAt),
          updatedAt: new Date((session as any).updatedAt),
        };
        return acc;
      },
      {} as Record<string, InterviewSession>
    );

    console.log(
      `Đã khôi phục ${
        Object.keys(interviewSessions).length
      } phiên phỏng vấn từ localStorage`
    );
  } catch (e) {
    console.error("Lỗi khi khôi phục phiên phỏng vấn từ localStorage:", e);
    interviewSessions = {}; // Reset to empty object on error
  }
};

// Hàm để đọc cookie từ document nếu được gọi từ client-side
const getSessionIdFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("interview_session_id=")) {
      return cookie.substring("interview_session_id=".length);
    }
  }
  return null;
};

// Khởi tạo nếu đang chạy ở client-side
if (typeof window !== "undefined") {
  loadSessionsFromStorage();

  // Kiểm tra session_id trong cookie
  const sessionId = getSessionIdFromCookie();
  if (sessionId) {
    console.log(`Tìm thấy sessionId trong cookie: ${sessionId}`);

    // Kiểm tra nếu session này không có trong localStorage, nhưng có cookie
    if (!interviewSessions[sessionId]) {
      console.warn(
        `Session ${sessionId} có trong cookie nhưng không có trong localStorage`
      );
    }
  }
}

export const db = {
  // Tạo phiên phỏng vấn mới
  createSession: (
    sessionId: string,
    name: string,
    topic: string,
    firstQuestion: string,
    position: string = "Không xác định"
  ): InterviewSession => {
    console.log(
      `Tạo phiên phỏng vấn mới với ID: ${sessionId}, chủ đề: ${topic}, vị trí: ${position}`
    );

    const newSession: InterviewSession = {
      sessionId,
      name,
      topic,
      position,
      questions: [firstQuestion],
      answers: [],
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    interviewSessions[sessionId] = newSession;
    saveSessionsToStorage();
    return newSession;
  },

  // Lấy thông tin phiên phỏng vấn
  getSession: (sessionId: string): InterviewSession | null => {
    console.log(`Đang tìm phiên phỏng vấn với ID: ${sessionId}`);

    if (!sessionId) {
      console.error("sessionId là null hoặc undefined");
      return null;
    }

    try {
      // Luôn khôi phục lại phiên từ localStorage nếu đang ở client-side
      if (typeof window !== "undefined") {
        loadSessionsFromStorage();
      }

      const session = interviewSessions[sessionId];
      if (!session) {
        console.log(`Không tìm thấy phiên phỏng vấn với ID: ${sessionId}`);
        return null;
      }

      console.log(
        `Lấy thông tin phiên phỏng vấn: ${sessionId}, số câu hỏi: ${session.questions.length}`
      );
      return session;
    } catch (error) {
      console.error(`Lỗi khi truy xuất phiên phỏng vấn: ${sessionId}`, error);
      return null;
    }
  },

  // Cập nhật phiên phỏng vấn với câu trả lời mới và câu hỏi mới
  updateSession: (
    sessionId: string,
    answer: string,
    nextQuestion: string,
    isCompleted: boolean = false
  ): InterviewSession | null => {
    console.log(`Cập nhật phiên phỏng vấn: ${sessionId}`);

    const session = interviewSessions[sessionId];
    if (!session) {
      console.error(`Không tìm thấy phiên phỏng vấn để cập nhật: ${sessionId}`);
      return null;
    }

    // Thêm câu trả lời mới
    session.answers.push(answer);

    // Thêm câu hỏi mới
    session.questions.push(nextQuestion);

    // Đánh dấu nếu phiên phỏng vấn đã hoàn thành
    if (isCompleted) {
      session.isCompleted = true;
    }

    // Cập nhật thời gian
    session.updatedAt = new Date();

    // Lưu vào localStorage
    saveSessionsToStorage();

    return session;
  },

  // Lấy tất cả câu hỏi và câu trả lời của một phiên phỏng vấn
  getSessionTranscript: (sessionId: string) => {
    console.log(`Lấy bản ghi phiên phỏng vấn: ${sessionId}`);

    // Khôi phục lại session từ localStorage nếu cần
    if (typeof window !== "undefined" && !interviewSessions[sessionId]) {
      loadSessionsFromStorage();
    }

    const session = interviewSessions[sessionId];
    if (!session) {
      console.error(
        `Không tìm thấy phiên phỏng vấn để lấy bản ghi: ${sessionId}`
      );
      return null;
    }

    const messages = [];
    for (let i = 0; i < session.questions.length; i++) {
      messages.push({
        role: "interviewer",
        content: session.questions[i],
      });

      if (i < session.answers.length) {
        messages.push({
          role: "user",
          content: session.answers[i],
        });
      }
    }

    console.log(
      `Đã tạo bản ghi với ${messages.length} tin nhắn cho phiên: ${sessionId}`
    );
    return {
      sessionId: session.sessionId,
      name: session.name,
      topic: session.topic,
      position: session.position,
      isCompleted: session.isCompleted,
      messages,
    };
  },

  // Lấy danh sách tất cả các phiên phỏng vấn
  getAllSessions: () => {
    // Khôi phục lại session từ localStorage nếu cần
    if (
      typeof window !== "undefined" &&
      Object.keys(interviewSessions).length === 0
    ) {
      loadSessionsFromStorage();
    }

    return Object.values(interviewSessions).map((session) => ({
      sessionId: session.sessionId,
      name: session.name,
      topic: session.topic,
      position: session.position,
      isCompleted: session.isCompleted,
      createdAt: session.createdAt,
      questionCount: session.questions.length,
      answerCount: session.answers.length,
    }));
  },

  // Thêm câu trả lời vào phiên phỏng vấn
  addAnswer: (sessionId: string, answer: string): void => {
    console.log(`Thêm câu trả lời mới vào phiên: ${sessionId}`);

    const session = interviewSessions[sessionId];
    if (!session) {
      console.error(
        `Không tìm thấy phiên phỏng vấn để thêm câu trả lời: ${sessionId}`
      );
      return;
    }

    session.answers.push(answer);
    session.updatedAt = new Date();

    // Lưu vào localStorage sau khi thêm câu trả lời
    saveSessionsToStorage();
  },

  // Thêm câu hỏi vào phiên phỏng vấn
  addQuestion: (sessionId: string, question: string): void => {
    console.log(`Thêm câu hỏi mới vào phiên: ${sessionId}`);

    const session = interviewSessions[sessionId];
    if (!session) {
      console.error(
        `Không tìm thấy phiên phỏng vấn để thêm câu hỏi: ${sessionId}`
      );
      return;
    }

    session.questions.push(question);
    session.updatedAt = new Date();

    // Lưu vào localStorage sau khi thêm câu hỏi
    saveSessionsToStorage();
  },

  // Đánh dấu phiên phỏng vấn đã hoàn thành
  completeSession: (sessionId: string): void => {
    console.log(`Hoàn thành phiên phỏng vấn: ${sessionId}`);

    const session = interviewSessions[sessionId];
    if (!session) {
      console.error(
        `Không tìm thấy phiên phỏng vấn để đánh dấu hoàn thành: ${sessionId}`
      );
      return;
    }

    session.isCompleted = true;
    session.updatedAt = new Date();

    // Lưu vào localStorage sau khi cập nhật trạng thái
    saveSessionsToStorage();
  },

  // Kiểm tra session_id từ cookie
  getCurrentSessionFromCookie: (): InterviewSession | null => {
    const sessionId = getSessionIdFromCookie();
    if (!sessionId) return null;

    return db.getSession(sessionId);
  },
};
