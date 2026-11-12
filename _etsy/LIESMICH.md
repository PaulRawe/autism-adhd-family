# Etsy-Abgleich

Hier landet der Etsy-Export. So geht's:

1. Etsy → Shop-Manager → Einstellungen → Optionen → Daten herunterladen → **Inserate als CSV herunterladen**
2. Die Datei hier als `etsy-listings.csv` hochladen (alte Datei ersetzen)
3. Die Action „Etsy-Abgleich“ läuft von selbst und entfernt alles, was es nicht mehr im Shop gibt
4. Was passiert ist, steht danach in `etsy-abgleich-bericht.md`

Nur gucken, ohne etwas zu ändern: Actions → „Etsy-Abgleich“ → Run workflow → Haken bei „Nur prüfen“.
Der Ordner beginnt mit `_`, damit er nicht auf der Website erscheint.
