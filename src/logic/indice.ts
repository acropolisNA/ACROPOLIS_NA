import { doc, setTitle } from "../helpers/components"
import { getParams } from "../helpers/storage"


const params = getParams()
const sede = params.get('sede') as string

setTitle(`ÍNDICE ${sede}`)

const asistLink  = doc.getElementById('asistLink') as HTMLLinkElement
asistLink.href   = `/asistencia.html?sede=${sede}`
const avanceLink = doc.getElementById('avanceLink') as HTMLLinkElement
avanceLink.href  = `/avance.html?sede=${sede}`
const cumpleLink = doc.getElementById('cumpleLink') as HTMLLinkElement
cumpleLink.href  = `/cumples.html?sede=${sede}`
