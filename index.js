// index.js
import { getGmailClient } from "./auth.js";

const FOOD_KEYWORDS = [
  "food",
  "recipe",
  "restaurant",
  "meal",
  "snack",
  "groceries",
  "calories",
  "nutrition",
  "protein",
  "ingredients",
  "dish",
  "cook",
  "dinner",
  "breakfast",
  "lunch",
];

function buildQuery() {
  return FOOD_KEYWORDS.map(k => `subject:${k} OR body:${k}`).join(" OR ");
}

async function main() {
  const gmail = await getGmailClient();
  const query = buildQuery();

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 30,
  });

  const messages = res.data.messages || [];
  console.log(`Found ${messages.length} food-related emails\n`);

  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const headers = detail.data.payload.headers;
    const subject = headers.find(h => h.name === "Subject")?.value;
    const from = headers.find(h => h.name === "From")?.value;

    console.log("From:", from);
    console.log("Subject:", subject);
    console.log("–––––––––––––––––––––––––––––––\n");
  }
}

main();
