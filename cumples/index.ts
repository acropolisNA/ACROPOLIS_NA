import { apiUrl } from "../src/helpers/api";
import { addLoading, doc, removeLoading, setTitle } from "../src/helpers/components";
import { getLocal, getParams, setLocal } from "../src/helpers/storage";
import type { CumplesInfo, MesCorto, RowCumple } from "../src/helpers/types";


const params = getParams()
const sede = params.get('sede') || ''
const dataCU = 'infoCumples'
let dataCumples = getLocal(dataCU)


const genRow = (val:RowCumple) => `
  <tr>
    <td class="border border-gray-300 px-2 py-1 bg-white">${val[0]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white">${val[1]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white underline"><a href="https://wa.me/51${val[2]}" target="_blank">${val[2]}</a></td>
    <td class="border border-gray-300 px-2 py-1 bg-white">${val[3]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white">${val[4]}</td>
    <td class="border border-gray-300 px-2 py-1 bg-white">${val[5]}</td>
  </tr>`


setTitle(sede)

const emailEl = doc.getElementById('email') as HTMLInputElement
const monthEl = doc.getElementById('monthCumple') as HTMLSelectElement
const tablaEl = doc.getElementById('cumplesContent') as HTMLTableSectionElement


const genTableInfo = (month:MesCorto) => {
  const monthVals = dataCumples[month]
  let inner = ''
  for(let rowInfo of monthVals){
    inner += genRow(rowInfo)
  }
  tablaEl.innerHTML = inner
}

monthEl?.addEventListener('change',(e)=> {
  const month = (e.target as HTMLSelectElement).value as MesCorto
  if(dataCumples){
    genTableInfo(month)
  }else{
    const email = emailEl.value
    if(!email|| !month ) return

    addLoading()
    fetch(`${apiUrl}?type=cumples&sedeId=${sede}&email=${email}`)
    .then(res => res.json())
      .then((data:CumplesInfo) => {
        const {success,msg,ans} = data

        if(!success) {
          removeLoading()
          return window.alert(msg)
        }
        dataCumples = ans
        
        genTableInfo(month)
        setLocal(dataCU,ans)
        removeLoading()
      })
      .catch(err => console.log(err))
  }


})
