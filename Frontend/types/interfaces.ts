export type Anapliroths = anapliroths[]

export interface anapliroths {
  ID: string
  Typos: string
  Eponymo: string
  Onoma: string
  Patronymo: string
  Klados: string
  Seira_Pinaka: number
  Moria_Pinaka: number
  Perioxh_Topothethshs: string
  Dieytynsh_Ekpaideyshs: string
  Hmeromnia: string
  Etos: string
  Sxolia: string
}

export interface ApiResult<T> {
  Status: boolean
  data: T
  Error?: {
    ErrorCode: number
  }
}

export interface chartDataInterface {
  label: string
  data: number
}
