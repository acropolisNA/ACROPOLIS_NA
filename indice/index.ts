import { doc, setTitle } from "../src/helpers/components"
import { getParams } from "../src/helpers/storage"


const params = getParams()
const sede = params.get('sede') as string

setTitle(sede)

const asistLink  = doc.getElementById('asistLink') as HTMLLinkElement
asistLink.href   = `/asistencia/index.html?type=asist&sede=${sede}`
const avanceLink = doc.getElementById('avanceLink') as HTMLLinkElement
avanceLink.href  = `/avance/index.html?type=asist&sede=${sede}`
const cumpleLink = doc.getElementById('cumpleLink') as HTMLLinkElement
cumpleLink.href  = `/cumples/index.html?type=asist&sede=${sede}`
