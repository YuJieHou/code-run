// 记录加载状态
const preprocessorLoaded = {
    html: true,
    javascript: true,
    css: true,
    less: false,
    scss: false,
    sass: false,
    stylus: false,
    postcss: false,
    pug: false,
    babel: false,
    typescript: false,
    coffeeScript: false,
    coffeeScript2: false,
}

// 需要加载多个文件
const resources = {
    postcss: ['postcss-cssnext', 'postcss']
}

export const load = (preprocessorList) => {
    // 过滤出没有加载过的资源
    let notLoaded = preprocessorList.filter((item) => {
        return !preprocessorLoaded[item]
    })
    if (notLoaded.length <= 0) {
        return
    }
    return new Promise((resolve, reject) => {
        // 生成加载资源的路径
        let jsList = []
        notLoaded.forEach((item) => {
            let _resources = (resources[item] || [item]).map((r) => {
                return /^https?/.test(item) ? item : `/parses/${r}.js`
            })
            jsList.push(..._resources)
        })
        loadjs(jsList, {
            returnPromise: true
        }).then(() => {
            notLoaded.forEach((item) => {
                preprocessorLoaded[item] = true
            })
            resolve()
        }).catch((err) => {
            reject(err)
        })
    })
}