import { apiUrl } from "../helpers/api";
import { addLoading, doc, genOption, removeLoading, setTitle } from "../helpers/components";
import { getLocal, getParams, setLocal } from "../helpers/storage";
import type { AsistAnsInfo, AsistenciaInfo, RowAsit } from "../helpers/types";


const params = getParams()
const sede = params.get('sede') || ''
setTitle(`ASISTENCIA ${sede}`)

const dataAS = 'infoAsist'

const inEmail = doc.getElementById('email') as HTMLInputElement
const btnBuscar = doc.getElementById('btnBuscar') as HTMLButtonElement
const btnJustificar = doc.getElementById('btnJustificar') as HTMLInputElement
const selGrupo = doc.getElementById('grupoList') as HTMLSelectElement
const selWeek = doc.getElementById('weekList') as HTMLSelectElement
const tabAsist = doc.getElementById('miembrosContent') as HTMLTableSectionElement
const dataAsist:[string,AsistAnsInfo] = getLocal(dataAS)

let gruposInfo
const listIds:string[] = []

  const setWeekGroups = (data:[string,AsistAnsInfo]) => {
    inEmail.value = data[0]
    const [listGroups,groupsInfo,weekList] = data[1]

    gruposInfo = groupsInfo

    let innerGrupo = ''
    for(let grupo of listGroups){
      innerGrupo += genOption(grupo,grupo)
    }

    let innerWeek = ''
    for(let weekVal of weekList){
      const [week,limits] = weekVal
      innerWeek += genOption(week,limits)
    }

    selGrupo.innerHTML = innerGrupo
    selWeek.innerHTML = innerWeek
  }

if(dataAsist) setWeekGroups(dataAsist)

btnBuscar.addEventListener('click',()=>{
  if(dataAsist) return

  addLoading()

  const email = inEmail.value.toLowerCase()
  fetch(`${apiUrl}?type=asistencia&sedeId=${sede}&email=${email}`)
    .then(res => res.json())
    .then((data:AsistenciaInfo) => {
      const {success,ans,msg} = data

      if(!success){
        removeLoading()
        return window.alert(msg)
      }

      setWeekGroups([email,ans])
      setLocal(dataAS,[email,ans])
      removeLoading()
      // removeButton()
      
    })
    .catch(err => console.log(err))
})


const genRow = (miembro:RowAsit) => {
  return `<tr id="${miembro[0]}">
    <td class="border border-gray-300 px-2 py-1 bg-white">${miembro[1]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white">${miembro[2]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white underline"><a href="https://wa.me/51${miembro[3]}" target="_blank">${miembro[3]}</a></td>

    <td class="border border-gray-300 px-2 py-1 bg-white">
      <input type="radio" name="${miembro[0]}" value="P" />
    </td>
    <td class="border border-gray-300 px-2 py-1 bg-white ">
      <input type="radio" name="${miembro[0]}" value="V" />
    </td>
    <td class="border border-gray-300 px-2 py-1 bg-white">
      <input type="radio" name="${miembro[0]}" value="J" />
    </td>
    <td class="border border-gray-300 px-2 py-1 bg-white">
      <input type="radio" name="${miembro[0]}" value="A" />
    </td>
  </tr>`
}

selGrupo.addEventListener('change',(e)=>{
  const grupo = (e.target as HTMLSelectElement).value 
  const miembros = gruposInfo![grupo];
  let inner = ''
  listIds.length = 0 
  for(let miembro of miembros){
    listIds.push(miembro[0])
    inner += genRow(miembro)
  }
  tabAsist.innerHTML = inner
})

btnJustificar.addEventListener('click',()=>{
  const radiosJ = doc.querySelectorAll<HTMLInputElement>('input[type="radio"][value="J"]') 
  radiosJ.forEach(r => r.checked = true);
})