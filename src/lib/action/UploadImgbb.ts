


export const UploadImagebb = async (image: File) => {

    const formdata = new FormData()
    formdata.append('image', image)
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`, {
        method: 'POST',
        body: formdata
    })

    const data = await res.json()


    return data.data;
}