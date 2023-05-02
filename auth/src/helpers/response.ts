
export const successRes = (message: string) => {
    return {
        status: 'success',
        message
    }
}

export const errorRes = (message: string) => {
    return {
        status: 'error',
        message
    }
}

