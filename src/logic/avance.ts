import { apiUrl } from "../helpers/api";
import { addLoading, doc, genOption, removeLoading, setTitle } from "../helpers/components";
import { getLocal, getParams, setLocal } from "../helpers/storage";
import type { AvanceAnsInfo, AvanceInfo } from "../helpers/types";


const params = getParams()
const sede = params.get('sede') || ''
const dataCU = 'infoCursos'
const dataCursos:[string,AvanceAnsInfo] = getLocal(dataCU) //[email,info]
let temasInfo, gruposCursos

setTitle(sede)

const btnBuscar = doc.getElementById('btnBuscar') as HTMLButtonElement
const inEmail = doc.getElementById('email') as HTMLInputElement
const selGrupo = doc.getElementById('grupoList') as HTMLSelectElement
const selWeek = doc.getElementById('weekList') as HTMLSelectElement
const selCurso = doc.getElementById('cursoList') as HTMLSelectElement
const selTema = doc.getElementById('temaList') as HTMLSelectElement


// Helper set info in inputs
  const setWeekGroups = (data:[string,AvanceAnsInfo]) => {
    inEmail.value = data[0]
    const [listGroups,cursosGroups,cursosInfo,weekList] = data[1]

    gruposCursos = cursosGroups
    temasInfo = cursosInfo

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

if(dataCursos)  setWeekGroups(dataCursos)

btnBuscar.addEventListener('click',()=>{
  if(dataCursos) return

  const email = inEmail.value
  addLoading()
  fetch(`${apiUrl}?type=avance&sedeId=${sede}&email=${email}`)
    .then(res => res.json())
    .then( (data:AvanceInfo) => {
      const {success,msg,ans} = data

      if(!success){
        removeLoading()
        return window.alert(msg)
      }
      setWeekGroups([email,ans])
      setLocal(dataCU,[email,ans])
      removeLoading()
      // removeButton()
    })
    .catch(err => console.log(err))
})


selGrupo.addEventListener('change',(e)=>{
  const grupo = (e.target as HTMLSelectElement).value 
  const cursos = gruposCursos![grupo];
  let inner = ''
  for(let curso of cursos){
    inner += genOption(curso,curso)
  }
  selCurso.innerHTML = inner
})


selCurso.addEventListener('change',(e)=>{
  const curso = (e.target as HTMLSelectElement).value 
  const temas = temasInfo![curso].temas;
  console.log(temas)
  let inner = ''
  for(let tema of temas){
    inner += genOption(tema[0],tema[1])
  }
  selTema.innerHTML = inner
})