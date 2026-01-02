const fs = require("fs");
const path = require("path");

/**
 * @jest-environment jsdom
 */

describe("Budget App Assessment", () => {
  let isStudentIdValid = false;
  let validationError = "";

  // --- STEG 1: PORTVAKTEN (Körs en gång innan allt annat) ---
  beforeAll(() => {
    try {
      const studentIdPath = path.join(__dirname, "src/student-id.js");

      if (!fs.existsSync(studentIdPath)) {
        validationError = "Filen 'src/student-id.js' saknas helt.";
        return;
      }

      const fileContent = fs.readFileSync(studentIdPath, "utf-8");

      //  Kolla efter förbjudna fraser direkt i källkoden
      if (fileContent.includes("PUT_YOUR_ID_HERE")) {
        validationError =
          "Du har inte bytt ut 'PUT_YOUR_ID_HERE' mot ditt eget ID.";
      } else if (fileContent.includes("student-exempel-123")) {
        validationError =
          "Du använder exempel-ID:t. Ange ditt RIKTIGA ansökningsnummer.";
      } else if (fileContent.includes('const STUDENT_ID = "";')) {
        validationError = "STUDENT_ID är tomt.";
      } else {
        isStudentIdValid = true;
      }
    } catch (e) {
      validationError = `Ett tekniskt fel uppstod vid läsning av ID: ${e.message}`;
    }
  });

  // --- STEG 2: FÖRBEREDELSER (Körs inför VARJE test) ---
  beforeEach(() => {
    if (!isStudentIdValid) {
      throw new Error(
        `⛔ STOPP! Din inlämning är inte giltig: ${validationError}`
      );
    }

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

    // Vi måste ladda filerna för att funktionerna ska finnas i DOM:en
    try {
      require("./src/student-id.js");
    } catch (e) {}
    try {
      require("./src/script.js");
    } catch (e) {}
  });

  // --- STEG 3: TESTER ---

  test("1. Setup & ID Kontroll (Obligatorisk)", () => {
    // Detta test passerar bara om beforeAll godkände ID:t
    expect(isStudentIdValid).toBe(true);
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

  // --- KATEGORI 4: Inlämning av video (20p) ---

  test("Should contain a video file named 'videoprov'", () => {
    const validExtensions = [".mp4"];
    const requiredName = "videoprov";

    // Hämta alla filer i rotmappen
    // __dirname är mappen där testet ligger, vi vill kolla roten så vi går upp ett steg om testet ligger i en undermapp,
    const rootDir = process.cwd();
    const filesInRoot = fs.readdirSync(rootDir);

    // Leta efter filen
    const videoFileFound = filesInRoot.find((file) => {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      return name === requiredName && validExtensions.includes(ext);
    });

    if (!videoFileFound) {
      throw new Error(
        "Kunde inte hitta filen 'videoprov.mp4' i rotmappen. Kontrollera namnet noga!"
      );
    }
    expect(videoFileFound).toBeTruthy();
  });
});
