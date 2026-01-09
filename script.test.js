const fs = require("fs");
const path = require("path");

/**
 * @jest-environment jsdom
 */

describe("Budget App Assessment", () => {
  // --- FÖRBEREDELSER INFÖR VARJE TEST ---
  beforeEach(() => {
    // 1. Nollställ moduler så vi får en fräsch start varje gång
    jest.resetModules();

    // 2. Sätt upp "låtsas-webbplatsen" (DOM)
    document.body.innerHTML = `
      <input id="desc" />
      <input id="amount" />
      <button id="incomeBtn">Lägg till Inkomst</button>
      <button id="expenseBtn">Lägg till Utgift</button>
      <ul id="incomeList"></ul>
      <ul id="expenseList"></ul>
      <div id="balance">0</div>
    `;

    // 3. Ladda studentens script
    // Vi använder try-catch så att testerna inte kraschar helt om filen saknas,
    // utan istället misslyckas på de specifika testerna.
    try {
      require("./src/script.js");
    } catch (e) {
      console.error("Kunde inte ladda src/script.js:", e);
    }
  });

  // ==========================================================
  // KATEGORI 1: LOGIK
  // ==========================================================

  test("Should add an item to the income list", () => {
    document.getElementById("desc").value = "Lön";
    document.getElementById("amount").value = "20000";
    document.getElementById("incomeBtn").click();

    const list = document.getElementById("incomeList");

    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain("20000");
  });

  test("Should add an item to the expense list", () => {
    document.getElementById("desc").value = "Hyra";
    document.getElementById("amount").value = "5000";
    document.getElementById("expenseBtn").click();

    const list = document.getElementById("expenseList");

    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain("5000");
  });

  test("Should increase balance when income is added", () => {
    document.getElementById("desc").value = "Lön";
    document.getElementById("amount").value = "500";
    document.getElementById("incomeBtn").click();

    const balance = document.getElementById("balance");
    expect(balance.textContent).toBe("500");
  });

  test("Should decrease balance when expense is added", () => {
    // Först inkomst för att ha pengar
    const desc = document.getElementById("desc");
    const amount = document.getElementById("amount");
    desc.value = "Start";
    amount.value = "1000";
    document.getElementById("incomeBtn").click();

    // Sen utgift
    desc.value = "Mat";
    amount.value = "200";
    document.getElementById("expenseBtn").click();

    const balance = document.getElementById("balance");
    expect(balance.textContent).toBe("800");
  });

  // ==========================================================
  // KATEGORI 2: FORMAT & UX
  // ==========================================================

  test("Should format the list item text correctly", () => {
    // 1. Testa INKOMST (Strikt Regex)
    document.getElementById("desc").value = "Lön";
    document.getElementById("amount").value = "100";
    document.getElementById("incomeBtn").click();

    const incomeItem = document
      .getElementById("incomeList")
      .querySelector("li");

    expect(incomeItem.textContent).toMatch(/Lön - 100 kr \(Inkomst\)/);

    // 2. Testa UTGIFT (Strikt Regex)
    document.getElementById("desc").value = "Kaffe";
    document.getElementById("amount").value = "50";
    document.getElementById("expenseBtn").click();

    const expenseItem = document
      .getElementById("expenseList")
      .querySelector("li");
    expect(expenseItem.textContent).toMatch(/Kaffe - 50 kr \(Utgift\)/);
  });

  test("Should clear input fields after adding transaction", () => {
    const desc = document.getElementById("desc");
    const amount = document.getElementById("amount");

    desc.value = "Test";
    amount.value = "100";
    document.getElementById("incomeBtn").click();

    expect(desc.value).toBe("");
    expect(amount.value).toBe("");
  });

  // ==========================================================
  // KATEGORI 3: VALIDERING
  // ==========================================================

  test("Should NOT add transaction if inputs are empty", () => {
    // Vi lägger först till en GILTIG transaktion för att se om knappen ens fungerar.
    document.getElementById("desc").value = "Kontroll";
    document.getElementById("amount").value = "100";
    document.getElementById("incomeBtn").click();

    const list = document.getElementById("incomeList");

    if (list.children.length === 0) {
      throw new Error(
        "TESTET MISSLYCKADES: Kan inte verifiera validering eftersom funktionen för att lägga till inkomst inte fungerar än."
      );
    }

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("incomeBtn").click();

    expect(list.children.length).toBe(1);
  });

  test("Should handle invalid numbers gracefully", () => {
    document.getElementById("desc").value = "Kontroll";
    document.getElementById("amount").value = "100";
    document.getElementById("incomeBtn").click();

    const list = document.getElementById("incomeList");

    if (list.children.length === 0) {
      throw new Error(
        "TESTET MISSLYCKADES: Kan inte verifiera nummer-validering eftersom funktionen för att lägga till inkomst inte fungerar än."
      );
    }

    document.getElementById("desc").value = "Fel";
    document.getElementById("amount").value = "hej";
    document.getElementById("incomeBtn").click();

    expect(list.children.length).toBe(1);

    const balance = document.getElementById("balance");
    expect(balance.textContent).not.toBe("NaN");
  });

  // ==========================================================
  // KATEGORI 4: VIDEO
  // ==========================================================

  test("Should contain a video file named 'videoprov'", () => {
    const validExtensions = [".mp4"];
    const requiredName = "videoprov";

    const rootDir = process.cwd();
    const filesInRoot = fs.readdirSync(rootDir);

    const videoFileFound = filesInRoot.find((file) => {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext); // Tar bort filändelsen
      return name === requiredName && validExtensions.includes(ext);
    });

    if (!videoFileFound) {
      throw new Error("Kunde inte hitta filen 'videoprov.mp4' i rotmappen.");
    }
    expect(videoFileFound).toBeTruthy();
  });
});
