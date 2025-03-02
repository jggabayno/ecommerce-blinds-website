export const fetchColor = async(id,setColor) => {
    setColor({ isLoading: true,data: []})
    try {
        const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`colors/${id}`)
        const data = await response.data
        setColor({isLoading: false, data})
    } catch(error){
        setColor({ isLoading: false,data: []})
    }
}