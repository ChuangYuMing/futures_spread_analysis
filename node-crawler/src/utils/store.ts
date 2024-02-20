import Storage from '../storage/index.ts'

export type RecordYear<T> = { [year: string]: T }
export type RecordDate<K> = { [date: string]: K }

export async function saveData<T>(
  data: RecordYear<RecordDate<T>>,
  dataStorage: Storage
) {
  for (const year in data) {
    const fileName = year
    const yearData = data[year]
    let oldData: RecordDate<T>
    try {
      oldData = await dataStorage.getOldData<RecordDate<T>>(fileName)
    } catch (error) {
      oldData = {}
    }
    const newData = getSortData<T>({ ...oldData, ...yearData })
    await dataStorage.saveData<RecordDate<T>>(fileName, newData)
  }
}

function getSortData<T>(data: RecordDate<T>): RecordDate<T> {
  return Object.keys(data)
    .sort()
    .reduce((obj: RecordDate<T>, key: string) => {
      return { ...obj, [key]: data[key] }
    }, {})
}
