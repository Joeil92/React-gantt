import { setDefaultOptions } from 'date-fns'
import Home from '../pages/home/Home'
import { fr } from 'date-fns/locale'

setDefaultOptions({ locale: fr })

export default function App() {
  return <Home />
}
