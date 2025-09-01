import { apiUrl } from "../helpers/api";
import { addLoading, doc, genOption, removeLoading, setTitle } from "../helpers/components";
import { getLocal, getParams, setLocal } from "../helpers/storage";
import type { AvanceAnsInfo, AvanceInfo } from "../helpers/types";


const params = getParams()
const sede = params.get('sede') || ''
const dataCU = 'infoCursos'
let dataCursos:[string,AvanceAnsInfo] = getLocal(dataCU) //[email,info]
let temasInfo, gruposCursos

setTitle(`AVANCE ${sede}`)

const btnBuscar = doc.getElementById('btnBuscar') as HTMLButtonElement
const btnGuardar = doc.getElementById('btnGuardar') as HTMLButtonElement
const inEmail = doc.getElementById('email') as HTMLInputElement
const selGrupo = doc.getElementById('grupoList') as HTMLSelectElement
const selWeek = doc.getElementById('weekList') as HTMLSelectElement
const selCurso = doc.getElementById('cursoList') as HTMLSelectElement
const selTema = doc.getElementById('temaList') as HTMLSelectElement
const txtObservaciones = doc.getElementById('observaciones') as HTMLTextAreaElement


const _genOption = (val1:string,val2:string,text:string) => `<option value="${val1}"  data-id="${val2}">${text}</option>`

// Helper set info in inputs
  const setWeekGroups = (data:[string,AvanceAnsInfo]) => {
    inEmail.value = data[0]
    const [listGroups,cursosGroups,cursosInfo,weekList] = data[1]

    gruposCursos = cursosGroups
    temasInfo = cursosInfo

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

if(dataCursos)  setWeekGroups(dataCursos)

btnBuscar.addEventListener('click',()=>{
  if(dataCursos) return

  const email = inEmail.value.toLowerCase()
  if(!email) return
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
      dataCursos = [email,ans]
      removeLoading()
      // removeButton()
    })
    .catch(err => console.log(err))
})


selGrupo.addEventListener('change',(e)=>{
  const grupo = (e.target as HTMLSelectElement).value 
  if(!grupo) return
  const cursos = gruposCursos![grupo];
  let inner = _genOption('','','Selecciona el Curso')
  for(let curso of cursos){
    const [id,curs] = curso
    inner += _genOption(curs,id,curs)
  }
  selCurso.innerHTML = inner
})


selCurso.addEventListener('change',(e)=>{
  const curso = (e.target as HTMLSelectElement).value 
  if(!curso) return
  const temas = temasInfo![curso].temas;
  let inner = genOption('','Seleccione el tema')
  for(let tema of temas){
    inner += genOption(tema[0],tema[1])
  }
  selTema.innerHTML = inner
})

btnGuardar.addEventListener('click',()=>{
  const user = dataCursos[0]
  if(!user) return window.alert('Usuario invalido')
  const grupo = selGrupo.value
  if(!grupo) return window.alert('Debes seleccionar un grupo')
  const week = selWeek.value
  if(!week) return window.alert('Debes seleccionar una fecha')
  const tema = selTema.value
  if(!tema) return window.alert('Debes seleccionar un tema')
  const observaciones = txtObservaciones.value


  const cursoSelected = selCurso.options[selCurso.selectedIndex]
  const cursadaId = cursoSelected.dataset.id

  const data = {
    sedeId:sede,
    usuario:user,
    grupo,
    cursadaId,
    semana:week,
    temaId: tema,
    observaciones
  }

  // return console.log(JSON.stringify(data))
  addLoading()

  fetch(`${apiUrl}?type=avance`,{
    method:'POST',body: JSON.stringify(data,null,2)
  })
  .then(res => res.json())
  .then(data => {
    removeLoading()
    
    const {msg,success} = data
    window.alert(msg)
    if(success){
      selGrupo.value = ''
      selWeek.value = ''
      selCurso.value = ''
      selTema.value = ''
      txtObservaciones.value = ''
    }
  })
  .catch(err => {
    console.log(err)
    removeLoading()
  })
})