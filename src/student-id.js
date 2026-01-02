// Byt ut värdet mot ditt eget student-ID.
const STUDENT_ID = "PUT_YOUR_ID_HERE";

if (typeof globalThis !== "undefined") {
  globalThis.STUDENT_ID = STUDENT_ID;
} else if (typeof window !== "undefined") {
  window.STUDENT_ID = STUDENT_ID;
}
