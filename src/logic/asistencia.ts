import { apiUrl } from "../helpers/api";
import { addLoading, doc, genOption, removeLoading, setTitle } from "../helpers/components";
import { getLocal, getParams, setLocal } from "../helpers/storage";
import type { AsistAnsInfo, AsistenciaInfo, AsistValues, RowAsit, SimpleObj } from "../helpers/types";


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
const btnGuardar = doc.getElementById('save') as HTMLButtonElement
const txtObservaciones = doc.getElementById('observaciones') as HTMLTextAreaElement
let dataAsist:[string,AsistAnsInfo] = getLocal(dataAS)

let gruposInfo
const listIds:string[] = []

const setWeekGroups = (data:[string,AsistAnsInfo]) => {
  inEmail.value = data[0]
  const [listGroups,groupsInfo,weekList] = data[1]

  gruposInfo = groupsInfo

  let innerGrupo = genOption('','Selecciona el Grupo')
  for(let grupo of listGroups){
    innerGrupo += genOption(grupo,grupo)
  }

  let innerWeek = genOption('','Selecciona la Semana')
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
  if(!email) return
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
      dataAsist = [email,ans]
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
  if(!grupo) return
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

btnGuardar.addEventListener('click',()=>{
  const user = dataAsist[0]
  if(!user) return window.alert('Usuario invalido')
  const grupo = selGrupo.value
  if(!grupo) return window.alert('Debes seleccionar un grupo')
  const week = selWeek.value
  if(!week) return window.alert('Debes seleccionar una fecha')
    const observaciones = txtObservaciones.value

  addLoading()

  const asistVals:SimpleObj = {}
  
  const radios = doc.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked')
  const total = gruposInfo![grupo].length
  const resumen = [total,0,0,0,0] // P V J A
  const index = {P:1,V:2,J:3}
  let asist = 0

  radios.forEach( radio => {
    const val = radio.value as AsistValues
    if(val != 'A') {
      const miembroId = radio.name
      asistVals[miembroId] = val
      const i = index[val]
      resumen[i]++
      asist++
    }
  })
  resumen[4] = total-asist
  if(!asist) return window.alert('Todos los miembros no han asistido!!')

  const data = {
    sedeId:sede,
    usuario:user,
    grupo,
    semana:week,
    infoAsistencia:asistVals,
    observaciones,
    resumen
  }

  fetch(`${apiUrl}?type=asistenciaPost`,{
    method:'',headers:{"Content-Type":"application/json"},body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {
    const {success,msg} = data

    window.alert(msg)
    
    if(success){
      tabAsist.innerHTML = ''
      selGrupo.value = ''
      selWeek.value = ''
      txtObservaciones.value = ''
    }

    removeLoading()
  })
  .catch(err => {
    console.log(err)
    removeLoading()
  })

})