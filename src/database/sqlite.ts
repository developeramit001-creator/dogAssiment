import SQLite from 'react-native-sqlite-storage';
import { Breed, Group } from '../types/dog';
SQLite.enablePromise(true);
const dbPromise = SQLite.openDatabase({
  name: 'tripare_dogs.db',
  location: 'default',
});
export async function initDb() {
  const db = await dbPromise;
  await db.executeSql(
    'CREATE TABLE IF NOT EXISTS breeds (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, group_id TEXT, payload TEXT NOT NULL)',
  );
  await db.executeSql(
    'CREATE TABLE IF NOT EXISTS groups_table (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, payload TEXT NOT NULL)',
  );
  await db.executeSql(
    'CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT)',
  );
}
export async function replaceBreeds(breeds: Breed[]) {
  const db = await dbPromise;
  await db.executeSql('DELETE FROM breeds');
  for (const b of breeds)
    await db.executeSql(
      'INSERT OR REPLACE INTO breeds(id,name,group_id,payload) VALUES (?,?,?,?)',
      [
        b.id,
        b.attributes.name,
        b.relationships?.group?.data?.id ?? null,
        JSON.stringify(b),
      ],
    );
}
export async function upsertBreed(breed: Breed) {
  const db = await dbPromise;
  await db.executeSql(
    'INSERT OR REPLACE INTO breeds(id,name,group_id,payload) VALUES (?,?,?,?)',
    [
      breed.id,
      breed.attributes.name,
      breed.relationships?.group?.data?.id ?? null,
      JSON.stringify(breed),
    ],
  );
}
export async function getBreeds(): Promise<Breed[]> {
  const db = await dbPromise;
  const [result] = await db.executeSql(
    'SELECT payload FROM breeds ORDER BY name COLLATE NOCASE',
  );
  const rows: Breed[] = [];
  for (let i = 0; i < result.rows.length; i++)
    rows.push(JSON.parse(result.rows.item(i).payload) as Breed);
  return rows;
}
export async function replaceGroups(groups: Group[]) {
  const db = await dbPromise;
  await db.executeSql('DELETE FROM groups_table');
  for (const g of groups)
    await db.executeSql(
      'INSERT OR REPLACE INTO groups_table(id,name,payload) VALUES (?,?,?)',
      [g.id, g.attributes.name, JSON.stringify(g)],
    );
}
export async function getGroups(): Promise<Group[]> {
  const db = await dbPromise;
  const [r] = await db.executeSql(
    'SELECT payload FROM groups_table ORDER BY name COLLATE NOCASE',
  );
  const out: Group[] = [];
  for (let i = 0; i < r.rows.length; i++)
    out.push(JSON.parse(r.rows.item(i).payload) as Group);
  return out;
}
export async function setMeta(key: string, value: string) {
  const db = await dbPromise;
  await db.executeSql('INSERT OR REPLACE INTO meta(key,value) VALUES (?,?)', [
    key,
    value,
  ]);
}
export async function getMeta(key: string) {
  const db = await dbPromise;
  const [r] = await db.executeSql('SELECT value FROM meta WHERE key=?', [key]);
  return r.rows.length ? String(r.rows.item(0).value) : null;
}
export async function clearAll() {
  const db = await dbPromise;
  await db.executeSql('DELETE FROM breeds');
  await db.executeSql('DELETE FROM groups_table');
  await db.executeSql('DELETE FROM meta');
}
