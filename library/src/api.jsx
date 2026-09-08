

export const getEndpoint = () => {
    const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    return `${base}/books`
}

export const getApiOptions = () => {
    return {'method': 'GET'}
}
