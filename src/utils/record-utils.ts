export function eliminarNullsDeRecord(record: Record<string, string | null>): Record<string, string> {
  const data = Object.fromEntries(
    Object.entries(record).filter(
      (entry): entry is [string, string] => !!entry[1] // horrendo
    )
  );
  return data;
}
