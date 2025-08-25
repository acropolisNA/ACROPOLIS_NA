export const setLocal = (key:string,value:any) => sessionStorage.setItem(key,JSON.stringify(value))

export const getLocal = (key:string) => JSON.parse(sessionStorage.getItem(key))

export const getParams = () => new URLSearchParams(window.location.search)