import { describe, it, expect } from "vitest";
import {
  getStudentAssignmentById,
  isAssignmentComplete,
  MOCK_STUDENT_ASSIGNMENTS,
} from "@/lib/studentAssignments";

describe("getStudentAssignmentById", () => {
  it("returns the matching assignment when found", () => {
    const assignment = getStudentAssignmentById("asgn-u2-core");
    expect(assignment).toBeDefined();
    expect(assignment?.id).toBe("asgn-u2-core");
  });

  it("returns undefined when the assignment is not found", () => {
    expect(getStudentAssignmentById("does-not-exist")).toBeUndefined();
  });

  it("returns undefined when called with undefined", () => {
    expect(getStudentAssignmentById(undefined)).toBeUndefined();
  });

  it("returns undefined when called with an empty string", () => {
    expect(getStudentAssignmentById("")).toBeUndefined();
  });

  it("finds all fixture assignments by their IDs", () => {
    for (const assignment of MOCK_STUDENT_ASSIGNMENTS) {
      expect(getStudentAssignmentById(assignment.id)).toBe(assignment);
    }
  });
});

describe("isAssignmentComplete", () => {
  it("returns false for undefined", () => {
    expect(isAssignmentComplete(undefined)).toBe(false);
  });

  it("returns false for not_started status", () => {
    const a = MOCK_STUDENT_ASSIGNMENTS.find((x) => x.status === "not_started");
    expect(isAssignmentComplete(a)).toBe(false);
  });

  it("returns false for in_progress status", () => {
    const a = MOCK_STUDENT_ASSIGNMENTS.find((x) => x.status === "in_progress");
    expect(isAssignmentComplete(a)).toBe(false);
  });

  it("returns true for submitted status", () => {
    const a = MOCK_STUDENT_ASSIGNMENTS.find((x) => x.status === "submitted");
    expect(isAssignmentComplete(a)).toBe(true);
  });

  it("returns true for graded status", () => {
    const a = MOCK_STUDENT_ASSIGNMENTS.find((x) => x.status === "graded");
    expect(isAssignmentComplete(a)).toBe(true);
  });
});
