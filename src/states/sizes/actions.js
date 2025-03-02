export const fetchSize = async(setSizes) => {
    setSizes({ isLoading: true,data: []})
    try {
        const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('productsizes')
        const data = await response.data
        setSizes({isLoading: false, data})
    } catch(error){
        setSizes({ isLoading: false,data: []})
    }
}

export const addProductSize = async(productSize) => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('product/sizes/client', productSize)
    const data = await response.data;
    return data;
}