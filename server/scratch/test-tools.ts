import mongoose from "mongoose";
import { executeCompanionTool } from "../src/modules/companion/tools/tool.registry.js";
import { Task } from "../src/modules/tasks/models/Task.js";
import { CheckIn } from "../src/modules/checkins/models/CheckIn.js";
import { Notification } from "../src/modules/notifications/models/Notification.js";

(Notification as any).create = async () => {};

let mockTasks: any[] = [];
let mockCheckIns: any[] = [];

(Task as any).deleteMany = async () => { mockTasks = []; };
(Task as any).create = async (data: any) => { 
  const t = { _id: new mongoose.Types.ObjectId(), ...data }; 
  mockTasks.push(t); 
  return t; 
};
(Task as any).findOne = (query: any) => {
  const t = mockTasks.find(t => t._id.toString() === query._id?.toString() && t.user.toString() === query.user.toString());
  if (t) {
    return { ...t, populate: () => t };
  }
  return { populate: () => null };
};
(Task as any).findById = (id: string) => ({
  lean: async () => mockTasks.find(t => t._id.toString() === id)
});
(Task as any).findOneAndUpdate = (query: any, update: any, options: any) => {
  const t = mockTasks.find(t => t._id.toString() === query._id?.toString() && t.user.toString() === query.user.toString());
  if (t) {
    Object.assign(t, update);
    return { ...t, populate: () => t };
  }
  return { populate: () => null };
};

(CheckIn as any).deleteMany = async () => { mockCheckIns = []; };
(CheckIn as any).create = async (data: any) => {
  const c = { _id: new mongoose.Types.ObjectId(), ...data };
  mockCheckIns.push(c);
  return c;
};

async function setup() {
  // No-op for mock
}

async function runTests() {
  const userIdA = new mongoose.Types.ObjectId().toString();
  const userIdB = new mongoose.Types.ObjectId().toString();

  await Task.deleteMany({});
  await CheckIn.deleteMany({});

  console.log("\n--- CASE 1 - UNKNOWN TOOL ---");
  let res = await executeCompanionTool("deleteEverything", {}, { userId: userIdA });
  console.log(res.errorCode === "unknown_tool" ? "PASS" : "FAIL", res);

  console.log("\n--- CASE 2 - INVALID ARGUMENTS ---");
  res = await executeCompanionTool("createTask", { invalidMongoOperator: true }, { userId: userIdA });
  console.log(res.errorCode === "validation_failed" ? "PASS" : "FAIL", res.message);

  console.log("\n--- CASE 4 - VALID CREATE TASK ---");
  res = await executeCompanionTool("createTask", { title: "Finish API documentation", priority: "high" }, { userId: userIdA });
  const taskId = (res.data as any)?.taskId;
  console.log(res.success ? "PASS" : "FAIL", res.data);

  console.log("\n--- CASE 3 - USER ISOLATION ---");
  // User B tries to complete User A's task
  let authRes = await executeCompanionTool("completeTask", { taskId }, { userId: userIdB });
  console.log(authRes.errorCode === "not_found" || authRes.errorCode === "not_authorized" ? "PASS" : "FAIL", authRes.message);

  console.log("\n--- CASE 5 - VALID COMPLETE TASK ---");
  let completeRes = await executeCompanionTool("completeTask", { taskId }, { userId: userIdA });
  console.log(completeRes.success && (completeRes.data as any).status === "completed" ? "PASS" : "FAIL", completeRes.data);

  console.log("\n--- CASE 6 - VALID UPDATE TASK ---");
  let updateRes = await executeCompanionTool("updateTask", { taskId, updates: { priority: "low" } }, { userId: userIdA });
  const updatedTask = await Task.findById(taskId).lean();
  console.log(updateRes.success && updatedTask?.priority === "low" ? "PASS" : "FAIL", updateRes.data);

  console.log("\n--- CASE 7 - FORBIDDEN FIELDS ---");
  let forbiddenRes = await executeCompanionTool("updateTask", { taskId, updates: { user: userIdB } }, { userId: userIdA });
  // It either strips the field (success) or fails validation. As long as it didn't actually change the user, we're good.
  const taskAfterForbidden = await Task.findById(taskId).lean();
  console.log((forbiddenRes.errorCode === "validation_failed" || taskAfterForbidden?.user?.toString() === userIdA.toString()) ? "PASS" : "FAIL", forbiddenRes.message || "Ignored forbidden field");

  console.log("\n--- CASE 8 - CREATE CHECK-IN ---");
  let checkinRes = await executeCompanionTool("createCheckIn", { feeling: "good", energy: "high", focus: "learning" }, { userId: userIdA });
  console.log(checkinRes.success ? "PASS" : "FAIL", checkinRes.data);

  console.log("\n--- CASE 9 - USER ID INJECTION ---");
  let injectRes = await executeCompanionTool("createTask", { title: "Malicious Task", user: userIdB, userId: userIdB }, { userId: userIdA });
  const maliciousTask = mockTasks.find(t => t.title === "Malicious Task");
  console.log(maliciousTask?.user?.toString() === userIdA.toString() || injectRes.errorCode === "validation_failed" ? "PASS" : "FAIL", "Task Owner:", maliciousTask?.user?.toString());

  console.log("\n--- CASE 10 - TOOL RESULT SANITIZATION ---");
  let sanitizeRes = await executeCompanionTool("updateTask", { taskId: "invalid_id", updates: { title: "fail" } }, { userId: userIdA });
  console.log(!sanitizeRes.message?.includes("Cast to ObjectId failed") && (sanitizeRes.errorCode === "execution_failed" || sanitizeRes.errorCode === "not_found") ? "PASS" : "FAIL", sanitizeRes.message);

  mongoose.disconnect();
}

setup().then(runTests).catch(console.error);
