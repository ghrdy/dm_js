Le code permet une recherche asynchrone et récursive de fichier JSON contentant le total des ventes à partir d’un dossier ‘stores’. Ces fichiers peuvent être trouvés dans
d’autres dossiers grâce a la partie récursive de findFiles(). Ensuite les adresses des fichiers JSON sont
push dans un tableau. On calcule ensuite le grand total en concaténant les objets ‘’ total ‘’ de chaque
JSON présent dans ce tableau.



Pour tester convenablement le code il a fallu créer des fichiers JSON a la racine de stores mais aussi
dans un sous dossier pour tester l’intérêt du programme. Le dossier contentant le résultat est lui créé
automatiquement.

Pour l’utiliser sous esm j’ai remplacé les require par des imports et passé le code en .mjs.

Le seul problème encouru est que l’accès au dossier courant grâce à __dirname n’est pas possible
sous esm sans importer une partie du module ‘url’ et en redéfinissant nous même __dirname.
