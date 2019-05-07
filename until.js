const fontSize = () => {
    let deviceWidth = document.documentElement.offsetWidth;
    if (deviceWidth > 1920) {
        deviceWidth = 1920;
    }
    let fontsize = deviceWidth / 19.2;
    document.documentElement.style = `font-size:${fontsize}px`
    console.log(fontsize);
}
//文件流转BinaryString
const fixdata = (data) => {
    let o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

const getDocument = (obj) => {
    return new Promise(function (resolve, reject) {
        let wb // 读取完成的数据
        let rABS = false // 是否将文件读取为二进制字符串
        if (!obj.files) {
            return
        }
        let f = obj.files[0]
        let reader = new FileReader();
        if (rABS) {
            reader.readAsArrayBuffer(f)
        } else {
            reader.readAsBinaryString(f)
        }
        let arr = []
        reader.onload = function (e) {
            let data = e.target.result
            if (rABS) {
                wb = XLSX.read(btoa(fixdata(data)), { // 手动转化
                    type: 'base64'
                })
            } else {
                wb = XLSX.read(data, {
                    type: 'binary'
                })
            }

            arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            resolve(arr)
        }
        reader.onerror = function (e) {
            resolve("")
        }
    })
}
const timeExChange = (list) => {
    list.t = []
    list.total = 0
    for (let i = 0; i < 24; i++) {
        list.t.push(list[`${i}点`])
        if (list[`${i}点`]) {
            list.total += Number(list[`${i}点`])
        }
    }
    return list
}