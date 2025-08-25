type RegionCode = string;   // Ej: "AQP-CAY"
type RegionName = string;   // Ej: "AREQUIPA"
type SheetId = string;      // Ej: "17VqoFBmN0..."

type FirstObject = Record<RegionCode, SheetId>;

export type RegionsInfo = Record<RegionName, [string, RegionCode, string][]>;

type ThirdArray = RegionCode[];
export type ListRegions = RegionName[];

export type DataGetSedes = [FirstObject, RegionsInfo, ThirdArray, ListRegions];

export type MesCorto =
  | "ENE" | "FEB" | "MAR" | "ABR" | "MAY" | "JUN"
  | "JUL" | "AGO" | "SEP" | "OCT" | "NOV" | "DIC"

export type RowCumple = [number, number, number, string, string, string]

export type CumplesInfo = {
  success: boolean
  ans:{ [mes in MesCorto]: RowCumple[] }
  msg?: string
}

export type GroupsList = string[]

export type WeekInfo = [string,string]

export type AvanceAnsInfo = [GroupsList,Object,Object,WeekInfo[]]


export type AvanceInfo = {
  success: boolean,
  ans: AvanceAnsInfo
  msg?: string
}


export type RowAsit = [string,string,string,number]

export type AsistAnsInfo =[GroupsList,object,WeekInfo[]]

export type AsistenciaInfo = {
  success: boolean,
  ans: AsistAnsInfo
  msg?: string
}