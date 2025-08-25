import { doc, setTitle } from "../helpers/components"
import { getParams } from "../helpers/storage"


const params = getParams()
const sede = params.get('sede') as string

setTitle(sede)

const asistLink  = doc.getElementById('asistLink') as HTMLLinkElement
asistLink.href   = `/asistencia?type=asist&sede=${sede}`
const avanceLink = doc.getElementById('avanceLink') as HTMLLinkElement
avanceLink.href  = `/avance?type=asist&sede=${sede}`
const cumpleLink = doc.getElementById('cumpleLink') as HTMLLinkElement
cumpleLink.href  = `/cumples?type=asist&sede=${sede}`
