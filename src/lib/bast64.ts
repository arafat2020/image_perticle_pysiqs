export async function imageToBase64(url: string) {
    return new Promise(async (resolve, reject) => {
        const data = await fetch(url)
        const file = await data.blob()
        const reader = new FileReader();
        await reader.readAsDataURL(file);
        reader.onload = async () => {
            const str = reader.result
            resolve(str)
        }
        reader.onerror = function (error) {
            reject(error);
        };

    })

}