import {promises as fs } from 'fs'; // On passe de Cjs a ESM en utilisant les imports + l'extension .mjs  / J'aurais pu utiliser un fichier
import path from 'path';

import { fileURLToPath } from 'url'; // dirname ne marche pas sous esm donc on doit utiliser url pour recup notre répertoire


const __filename = fileURLToPath(import.meta.url); // ici
const __dirname = path.dirname(__filename); //---

async function calculateSalesTotal(salesFiles) { // on recupere le total des ventes en concatenant les ventes de chaque fichiers. json du tableau salesFIles
  let salesTotal = 0;

  for (const file of salesFiles) { 
    const data = JSON.parse(await fs.readFile(file));

    salesTotal += data.total; // on concatene l'objet total
  }
  return salesTotal;
}

async function findSalesFiles(folderName) { // trouve tout les fichiers Json meme dans des sous repertoires a partir de 'stores' 
  let salesFiles = [];

  async function findFiles(folderName) { 
    const items = await fs.readdir(folderName, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        await findFiles(path.join(folderName, item.name)); // partie récursive
      } else {
        if (path.extname(item.name) === ".json") { // on trouve du json = on push dans salesFiles[] l'addresse du fichier
          await salesFiles.push(path.join(folderName, item.name));
        }
      }
    }
  }

  await findFiles(folderName);

  return salesFiles; // on return le tableau salesFiles contentant tout les addresses
}

async function main() {
  const salesDir = path.join(__dirname, "stores"); // dossier ou chercher
  const salesTotalsDir = path.join(__dirname, "salesTotals"):

  try { // si pas de dossier salesTotals on le crée
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  const salesFiles = await findSalesFiles(salesDir); // on recup toutes les addresses des fichiers.
 
  const salesTotal = await calculateSalesTotal(salesFiles); // on calc le total

  await fs.writeFile( // on ecrit le resultat
    path.join(salesTotalsDir, "totals.txt"),
    `Total at ${new Date().toLocaleDateString()} : ${salesTotal}€\r\n`,
    { flag: "a" }
  );
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
}

main();