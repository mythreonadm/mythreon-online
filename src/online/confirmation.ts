/** Local play returns immediately; online play supplies the actual server receipt. */
export async function confirmedAction<T extends { success: boolean; error?: string }>(result: T): Promise<T> {
  const confirmation = (result as T & { confirmation?: Promise<T> }).confirmation;
  if (!confirmation) return result;
  try { return await confirmation; }
  catch (error) { return { ...result, success: false, error: error instanceof Error ? error.message : "A confirmação não foi concluída." }; }
}
