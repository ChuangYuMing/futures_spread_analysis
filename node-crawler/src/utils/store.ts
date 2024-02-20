import Storage from '../storage/index.ts'

export type SaveDataType<T> = { [year: string]: T }

export async function saveData<T>(data: SaveDataType<T>, dataStorage: Storage) {
  for (const year in data) {
    const fileName = year
    const yearData = data[year]
    let oldData
    try {
      oldData = await dataStorage.getOldData<T>(fileName)
    } catch (error) {
      oldData = {}
    }
    const newData = { ...oldData, ...yearData }
    await dataStorage.saveData<T>(fileName, newData)
  }
}
