import { createClient } from "redis";

interface InterviewSession {
  sessionId: string;
  name: string;
  topic: string;
  position: string;
  questions: string[];
  answers: string[];
  isCompleted: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Thời gian tồn tại của phiên (24 giờ)
const SESSION_TTL = 60 * 60 * 24;

// Prefix cho session keys
const SESSION_PREFIX = "interview_session:";

// Thời gian chờ trước khi thử kết nối lại (ms)
const RECONNECT_DELAY = 1000;

// Số lần thử kết nối lại tối đa
const MAX_RECONNECT_ATTEMPTS = 3;

// Thời gian timeout cho các request Redis (ms)
const REDIS_TIMEOUT = 5000;

// Redis connection URL - Load from environment variable
const REDIS_URL = process.env.REDIS_URL || "";

// Validation check for Redis URL
if (!REDIS_URL) {
  console.warn(
    "⚠️  REDIS_URL environment variable is not set. Interview sessions will not be persisted."
  );
}

// Hàm chuyển đổi chuỗi JSON Date thành đối tượng Date
const parseJsonDates = (session: InterviewSession): InterviewSession => {
  if (typeof session.createdAt === "string") {
    session.createdAt = new Date(session.createdAt);
  }
  if (typeof session.updatedAt === "string") {
    session.updatedAt = new Date(session.updatedAt);
  }
  return session;
};

// Singleton Redis client
let redisClient: any = null;
let isConnecting = false;

// Tạo Redis client
const getRedisClient = async () => {
  // Nếu client đã tồn tại và đã kết nối, trả về client đó
  if (redisClient?.isOpen) {
    return redisClient;
  }

  // Nếu đang trong quá trình kết nối, đợi một chút
  if (isConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (redisClient?.isOpen) {
      return redisClient;
    }
  }

  isConnecting = true;

  try {
    // Tạo client mới nếu chưa tồn tại
    if (!redisClient) {
      redisClient = createClient({
        url: REDIS_URL,
        socket: {
          connectTimeout: REDIS_TIMEOUT,
          reconnectStrategy: (retries) => {
            if (retries > MAX_RECONNECT_ATTEMPTS) {
              console.error(
                `Redis: Đã thử kết nối lại ${MAX_RECONNECT_ATTEMPTS} lần, ngừng thử`
              );
              return new Error(
                `Không thể kết nối đến Redis sau ${MAX_RECONNECT_ATTEMPTS} lần thử`
              );
            }
            console.log(`Redis: Đang thử kết nối lại lần thứ ${retries}...`);
            return RECONNECT_DELAY * Math.min(retries, 10); // Tăng dần thời gian chờ, tối đa 10s
          },
        },
      });

      // Xử lý sự kiện kết nối
      redisClient.on("connect", () =>
        console.log("Redis: Đã kết nối thành công")
      );
      redisClient.on("ready", () => {
        console.log("Redis: Sẵn sàng nhận lệnh");
      });
      redisClient.on("reconnecting", () =>
        console.log("Redis: Đang kết nối lại...")
      );

      // Xử lý lỗi kết nối
      redisClient.on("error", (err: Error) => {
        console.error("Redis client error:", err);
      });

      redisClient.on("end", () => {
        console.log("Redis: Kết nối đã đóng");
      });
    }

    // Kết nối nếu chưa kết nối
    if (!redisClient.isOpen) {
      try {
        await redisClient.connect();
        console.log("Redis: Kết nối thành công");
      } catch (error) {
        console.error("Redis connection error:", error);
        throw error;
      }
    }

    return redisClient;
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  } finally {
    isConnecting = false;
  }
};

// Hàm để thử thực hiện một thao tác Redis với cơ chế thử lại
const executeWithRetry = async (operation: Function, ...args: any[]) => {
  let attempts = 0;

  while (attempts < MAX_RECONNECT_ATTEMPTS) {
    try {
      return await operation(...args);
    } catch (error) {
      attempts++;
      console.error(
        `Redis operation error (attempt ${attempts}/${MAX_RECONNECT_ATTEMPTS}):`,
        error
      );

      if (attempts >= MAX_RECONNECT_ATTEMPTS) {
        throw error;
      }

      // Đợi trước khi thử lại
      await new Promise((resolve) =>
        setTimeout(resolve, RECONNECT_DELAY * attempts)
      );
    }
  }
};

const redisDb = {
  /**
   * Tạo phiên phỏng vấn mới
   */
  createSession: async (
    sessionId: string,
    name: string,
    topic: string,
    firstQuestion: string,
    position: string = "Unknown position"
  ): Promise<InterviewSession | null> => {
    try {
      const client = await getRedisClient();

      const now = new Date();
      const session: InterviewSession = {
        sessionId,
        name,
        topic,
        position,
        questions: [firstQuestion],
        answers: [],
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      };

      // Lưu vào Redis dưới dạng JSON
      const key = SESSION_PREFIX + sessionId;
      await executeWithRetry(async () => {
        await client.set(key, JSON.stringify(session), {
          EX: SESSION_TTL,
        });
      });

      console.log(`Redis: Session created: ${sessionId}`);
      return session;
    } catch (error) {
      console.error("Redis error in createSession:", error);
      return null;
    }
  },

  /**
   * Lấy thông tin phiên phỏng vấn
   */
  getSession: async (sessionId: string): Promise<InterviewSession | null> => {
    try {
      if (!sessionId) {
        console.error("Redis: sessionId is null or undefined");
        return null;
      }

      const client = await getRedisClient();
      const key = SESSION_PREFIX + sessionId;

      const sessionData = await executeWithRetry(async () => {
        return await client.get(key);
      });

      if (!sessionData) {
        console.log(`Redis: Session not found: ${sessionId}`);
        return null;
      }

      const session = parseJsonDates(
        JSON.parse(sessionData) as InterviewSession
      );
      console.log(
        `Redis: Session retrieved: ${sessionId}, questions: ${session.questions.length}`
      );

      return session;
    } catch (error) {
      console.error(`Redis error in getSession for ${sessionId}:`, error);
      return null;
    }
  },

  /**
   * Cập nhật phiên phỏng vấn với câu trả lời mới và câu hỏi tiếp theo
   */
  updateSession: async (
    sessionId: string,
    answer: string,
    nextQuestion: string,
    isCompleted: boolean = false
  ): Promise<InterviewSession | null> => {
    try {
      const client = await getRedisClient();
      const key = SESSION_PREFIX + sessionId;

      const sessionData = await executeWithRetry(async () => {
        return await client.get(key);
      });

      if (!sessionData) {
        console.error(`Redis: Session not found for update: ${sessionId}`);
        return null;
      }

      const session = parseJsonDates(
        JSON.parse(sessionData) as InterviewSession
      );

      // Thêm câu trả lời mới
      session.answers.push(answer);

      // Thêm câu hỏi mới
      session.questions.push(nextQuestion);

      // Cập nhật trạng thái
      if (isCompleted) {
        session.isCompleted = true;
      }

      // Cập nhật thời gian
      session.updatedAt = new Date();

      // Lưu lại vào Redis với ttl cũ
      await executeWithRetry(async () => {
        await client.set(key, JSON.stringify(session), {
          EX: SESSION_TTL,
        });
      });

      console.log(
        `Redis: Session updated: ${sessionId}, questions: ${session.questions.length}, answers: ${session.answers.length}`
      );

      return session;
    } catch (error) {
      console.error(`Redis error in updateSession for ${sessionId}:`, error);
      return null;
    }
  },

  /**
   * Lấy transcript của phiên phỏng vấn
   */
  getSessionTranscript: async (
    sessionId: string
  ): Promise<{ messages: any[] } | null> => {
    try {
      const session = await redisDb.getSession(sessionId);

      if (!session) {
        return null;
      }

      // Tạo mảng câu hỏi-câu trả lời
      const messages = [];

      // Thêm câu hỏi đầu tiên
      if (session.questions.length > 0) {
        messages.push({
          timestamp: new Date(session.createdAt).toISOString(),
          type: "next_question",
          question: session.questions[0],
          answer: null,
        });
      }

      // Thêm các cặp câu hỏi-câu trả lời tiếp theo
      for (let i = 0; i < session.answers.length; i++) {
        messages.push({
          timestamp: new Date(session.updatedAt).toISOString(),
          type: "next_question",
          question: session.questions[i],
          answer: session.answers[i],
        });
      }

      return { messages };
    } catch (error) {
      console.error(
        `Redis error in getSessionTranscript for ${sessionId}:`,
        error
      );
      return null;
    }
  },

  /**
   * Lấy cookie phiên hiện tại
   */
  getCurrentSessionFromCookie: async (): Promise<InterviewSession | null> => {
    // Chức năng này sẽ được triển khai ở phía client
    // Trong Redis, chúng ta chỉ xử lý lưu trữ và truy xuất
    return null;
  },

  /**
   * Đóng kết nối Redis khi ứng dụng kết thúc
   */
  closeConnection: async (): Promise<void> => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.disconnect();
      console.log("Redis: Đã đóng kết nối");
    }
  },

  /**
   * Kiểm tra kết nối Redis
   */
  ping: async (): Promise<boolean> => {
    try {
      const client = await getRedisClient();
      const result = await executeWithRetry(async () => {
        return await client.ping();
      });
      return result === "PONG";
    } catch (error) {
      console.error("Redis ping failed:", error);
      return false;
    }
  },
};

// Đăng ký sự kiện để đóng kết nối khi ứng dụng kết thúc
if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing Redis connection");
    await redisDb.closeConnection();
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing Redis connection");
    await redisDb.closeConnection();
  });
}

export default redisDb;
