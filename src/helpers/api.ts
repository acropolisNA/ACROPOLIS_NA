import axios from "axios"
import type { DataGetSedes } from "./types"

export const apiUrl = import.meta.env.VITE_GAS


export const getSedes = async () => {
  const {data} = await axios.get(`${apiUrl}?type=sedes`)
  if(!data) return

  const info:DataGetSedes = data
  return info
}