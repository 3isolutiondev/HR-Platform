import { store } from '../redux/store'
import { setOpenSidebar, setHideSidebar } from '../redux/actions/webActions'

if (typeof localStorage.openSidebar !== 'undefined') {
  if (localStorage.openSidebar === 'true') {
    store.dispatch(setOpenSidebar())
  } else {
    store.dispatch(setHideSidebar())
  }
}
