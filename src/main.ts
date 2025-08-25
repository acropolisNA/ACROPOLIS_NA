import { addLoading, doc, removeLoading } from "./helpers/components"
import { apiUrl } from "./helpers/api"
import type { DataGetSedes, ListRegions, RegionsInfo } from "./helpers/types"
import { getLocal, setLocal } from "./helpers/storage"


const menu = doc.getElementById('menuSedes')!
const select = doc.getElementById('selectSede')!
let dataRegions:RegionsInfo = {}
const dataNA = 'infoSedes'

addLoading()

const genEnlace = (idSede:string,nombre:string,encargado:string) => `
  <a 
    href="/indice.html?sede=${idSede}"
    class="w-52 bg-[#F5F5F5] shadow p-4 space-y-2 rounded-md hover:-translate-y-2 duration-300 block cursor-pointer">
    <p class="text-xl text-center">${nombre}</p>
    <p class="text-sm text-center w-full text-[#014b44]">${encargado}</p>
  </a>`
const genOption = (region:string) => `
  <option value="${region}">${region}</option>`

const editSelect = (regionsData:RegionsInfo,listRegions:ListRegions) => {
  let innerSelect = ''
  for(let region of listRegions){
    innerSelect += genOption(region)
  }
  select.innerHTML = innerSelect

  dataRegions = regionsData
}

const eventSelect = () => {
  select.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value

    const sedes = dataRegions[value]
    console.log(sedes)
    if(!sedes || !sedes.length) return

    let innerMenu = ''
    for(let sede of sedes){
      const [nombre,id,encargado] = sede
      innerMenu += genEnlace(id,nombre,encargado)
    }

    menu.innerHTML = innerMenu
  })
      
  removeLoading()
}

const local:[RegionsInfo,ListRegions] = getLocal(dataNA)

if(local){
  const [regionsData,listRegions] = local

  editSelect(regionsData,listRegions)

  dataRegions = regionsData

  eventSelect()

}else{
  fetch(`${apiUrl}?type=sedes`)
    .then( res => res.json())
    .then((data:DataGetSedes) => {
      const [,regionsData,,listRegions] = data

      setLocal(dataNA,[regionsData,listRegions])
      
      editSelect(regionsData,listRegions)

      eventSelect()
    })
    .catch(err => console.log(err))
}

