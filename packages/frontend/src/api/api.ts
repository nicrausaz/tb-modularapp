/**
 * Get a module by id
 * @param id id of the module
 * @returns the module, if it exists
 */
export const getModuleById = async (id: string) => {
  const response = await fetch(`/api/modules/${id}`)
  return await response.json()
}
