/**
 * @jest-environment jsdom
 */

// In most Jest setups, you do *not* need to import { expect } from "@jest/globals";
// Jest provides a global `expect` automatically.

// ...existing code...
// describe("Transaction functionality", () => {
//   beforeEach(() => {
//     jest.resetModules();
//     document.body.innerHTML = `
//       <input id="desc" />
//       <input id="amount" />
//       <button id="incomeBtn"></button>
//       <button id="expenseBtn"></button>
//       <ul id="incomeList"></ul>
//       <ul id="expenseList"></ul>
//       <div id="balance"></div>
//     `;
//     require("./src/script.js");
//   });

//   it("adds an income and updates balance", () => {
//     const descInput = document.getElementById("desc");
//     const amountInput = document.getElementById("amount");
//     const incomeBtn = document.getElementById("incomeBtn");

//     const description = "Salary";
//     const amount = "1000";

//     descInput.value = description;
//     amountInput.value = amount;
//     incomeBtn.click();

//     expect(document.getElementById("incomeList").textContent).toContain(
//       `${description} - ${amount} kr (Inkomst)`
//     );
//     expect(document.getElementById("balance").textContent).toBe(amount);
//   });

//   it("adds an expense and updates balance", () => {
//     const descInput = document.getElementById("desc");
//     const amountInput = document.getElementById("amount");
//     const expenseBtn = document.getElementById("expenseBtn");

//     const description = "Groceries";
//     const amount = "200";

//     descInput.value = description;
//     amountInput.value = amount;
//     expenseBtn.click();

//     expect(document.getElementById("expenseList").textContent).toContain(
//       `${description} - ${amount} kr (Utgift)`
//     );
//     expect(document.getElementById("balance").textContent).toBe(`-${amount}`);
//   });
// });
/**
 * @jest-environment jsdom
 */

describe("Budget App Assessment", () => {
  let isStudentIdValid = false;
  let validationError = "";

  // --- STEG 1: PORTVAKTEN (Körs en gång innan allt annat) ---
  beforeAll(() => {
    // 1. Försök ladda student-id filen
    try {
      jest.isolateModules(() => {
        require("./src/student-id.js");
      });
    } catch (e) {
      validationError = "Filen 'src/student-id.js' saknas.";
      return; // Avbryt kontrollen, flaggan förblir false
    }

    // 2. Hämta ID från global eller window
    let id = null;
    if (typeof globalThis !== "undefined" && "STUDENT_ID" in globalThis) {
      id = globalThis.STUDENT_ID;
    } else if (typeof window !== "undefined" && "STUDENT_ID" in window) {
      id = window.STUDENT_ID;
    }

    // 3. Validera ID:t strikt
    if (!id) {
      validationError = "Variabeln STUDENT_ID hittades inte.";
    } else if (typeof id !== "string") {
      validationError = "STUDENT_ID måste vara en textsträng.";
    } else if (id === "PUT_YOUR_ID_HERE") {
      validationError =
        "Du har inte bytt ut 'PUT_YOUR_ID_HERE' mot ditt eget ID.";
    } else if (id.trim().length === 0) {
      validationError = "STUDENT_ID får inte vara tomt.";
    } else {
      // Allt ser bra ut! Släpp in studenten.
      isStudentIdValid = true;
    }
  });

  // --- STEG 2: FÖRBEREDELSER (Körs inför VARJE test) ---
  beforeEach(() => {
    // 4. TOTAL SPÄRR: Om ID är ogiltigt, krascha alla tester direkt
    if (!isStudentIdValid) {
      throw new Error(
        `⛔ STOPP! Din inlämning är inte giltig: ${validationError}`
      );
    }

    // Om vi kommer hit är ID okej. Kör ordinarie setup.
    jest.resetModules();
    document.body.innerHTML = `
      <input id="desc" />
      <input id="amount" />
      <button id="incomeBtn">Lägg till Inkomst</button>
      <button id="expenseBtn">Lägg till Utgift</button>
      <ul id="incomeList"></ul>
      <ul id="expenseList"></ul>
      <div id="balance">0</div>
    `;

    // Ladda om ID och script för att simulera en "fräsch" sida
    require("./src/student-id.js");
    require("./src/script.js");
  });

  // --- STEG 3: TESTER ---

  test("1. Setup & ID Kontroll (Obligatorisk)", () => {
    // Detta test kommer bara passera om beforeAll lyckades sätta flaggan till true.
    // Om flaggan är false har beforeEach redan kastat ett error, så vi kommer inte ens hit.
    expect(isStudentIdValid).toBe(true);
    expect(validationError).toBe("");
  });

  // --- KATEGORI 1: Grundläggande Funktionalitet ---

  test("Should add an item to the income list", () => {
    document.getElementById("desc").value = "Lön";
    document.getElementById("amount").value = "20000";
    document.getElementById("incomeBtn").click();

    const list = document.getElementById("incomeList");
    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain("Lön");
  });

  test("Should increase balance when income is added", () => {
    document.getElementById("desc").value = "Lön";
    document.getElementById("amount").value = "500";
    document.getElementById("incomeBtn").click();

    const balance = document.getElementById("balance");
    expect(balance.textContent).toBe("500");
  });

  test("Should add an item to the expense list", () => {
    document.getElementById("desc").value = "Hyra";
    document.getElementById("amount").value = "5000";
    document.getElementById("expenseBtn").click();

    const list = document.getElementById("expenseList");
    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain("Hyra");
  });

  test("Should decrease balance when expense is added", () => {
    const desc = document.getElementById("desc");
    const amount = document.getElementById("amount");
    desc.value = "Start";
    amount.value = "1000";
    document.getElementById("incomeBtn").click();

    desc.value = "Mat";
    amount.value = "200";
    document.getElementById("expenseBtn").click();

    const balance = document.getElementById("balance");
    expect(balance.textContent).toBe("800");
  });

  // --- KATEGORI 2: UX och Format ---

  test("Should clear input fields after adding transaction", () => {
    const desc = document.getElementById("desc");
    const amount = document.getElementById("amount");

    desc.value = "Test";
    amount.value = "100";
    document.getElementById("incomeBtn").click();

    expect(desc.value).toBe("");
    expect(amount.value).toBe("");
  });

  test("Should format the list item text correctly", () => {
    document.getElementById("desc").value = "Kaffe";
    document.getElementById("amount").value = "50";
    document.getElementById("expenseBtn").click();

    const listItem = document.getElementById("expenseList").querySelector("li");
    expect(listItem.textContent).toMatch(/Kaffe - 50 kr \(Utgift\)/);
  });

  // --- KATEGORI 3: Validering ---

  test("Should NOT add transaction if inputs are empty", () => {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("incomeBtn").click();

    const list = document.getElementById("incomeList");
    expect(list.children.length).toBe(0);
  });

  test("Should handle invalid numbers gracefully", () => {
    document.getElementById("desc").value = "Fel";
    document.getElementById("amount").value = "hej";
    document.getElementById("incomeBtn").click();

    const balance = document.getElementById("balance");
    const isSafe =
      balance.textContent === "0" ||
      document.getElementById("incomeList").children.length === 0;
    expect(isSafe).toBe(true);
    expect(balance.textContent).not.toBe("NaN");
  });
});
