# Antagningsprov: Budget- och Utgiftskoll

Välkommen till detta arbetsprov i JavaScript! Din uppgift är att skriva logiken (JavaScript) för att göra denna budget-applikation funktionell. HTML och CSS är redan färdigt och ska inte ändras.

## Uppgiftbeskrivning

Du ska arbeta i filen `script.js`. Målet är att användaren ska kunna skriva in en beskrivning och ett belopp, och sedan klicka på antingen "Lägg till Inkomst" eller "Lägg till Utgift".

När en transaktion läggs till ska följande ske:

1.  Transaktionen ska synas i rätt lista (Inkomster eller Utgifter).
2.  Det totala saldot ska uppdateras automatiskt.

## Funktionella Krav

För att klara uppgiften måste din kod uppfylla följande krav:

### 1. Hämta värden

När användaren klickar på en knapp måste du hämta värdet från textfälten:

- Beskrivning (`#desc`)
- Belopp (`#amount`)

### 2. Uppdatera listorna

Beroende på vilken knapp som klickas ("Lägg till Inkomst" eller "Lägg till Utgift") ska en ny rad (`<li>`) läggas till i motsvarande lista (`#incomeList` eller `#expenseList`).

**Viktigt:** Texten i listpunkten måste följa detta format exakt för att godkännas:

- För inkomst: `Beskrivning - Belopp kr (Inkomst)`
- För utgift: `Beskrivning - Belopp kr (Utgift)`

_Exempel:_ `Lön - 25000 kr (Inkomst)`

### 3. Beräkna Saldo

Saldot (`#balance`) ska starta på 0.

- Inkomster **ökar** saldot.
- Utgifter **minskar** saldot.
- Uppdatera texten i `#balance` med det nya totalbeloppet efter varje transaktion.

## Starta projektet

1.  Öppna `index.html` i din webbläsare för att se applikationen och testa din kod manuellt.
2.  Skriv din kod i `script.js`.
3.  Ladda om sidan i webbläsaren för att se dina ändringar.

Lycka till!
