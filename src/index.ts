console.log('ts ok?');
import superagent from 'superagent'
import cheerio from 'cheerio'
import path from 'path'
import fs from 'fs'
interface TitleArr {
    title: string;
}
interface JsonInfo {
    time: number;
    data: TitleArr[]
}
interface Content {
    [proName: number]: TitleArr[]
}
class Reptitle {
    private filePath = path.resolve(__dirname, '../data/data.json')
    // 请求url 
    private url = 'https://learning.sohu.com/?spm=smpc.home.top-nav.23.16537216095252G4EhHp'
    async getHtml() {
        let result = await superagent.get(this.url)
        return result.text
    }
    getJsonInfo(html: string) {
        const $ = cheerio.load(html)
        const item = $('.z-head-line_param')
        const titleArr: TitleArr[] = []
        item.map((index, ele) => {
            const childs = $(ele).find('a')
            const title = childs.text()
            titleArr.push({
                title
            })


        })
        return {
            time: new Date().getTime(),
            data: titleArr
        }

    }
    // 存入目录
    getNewcontent(jsonInfo: JsonInfo) {
        console.log(fs.existsSync(this.filePath))
        let fileContent: Content = {}
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse( fs.readFileSync(this.filePath,'utf-8') );
            fileContent[jsonInfo.time] = jsonInfo.data;
            // console.log(fileContent,'fileContent');

            return fileContent
        }
       
    }
    writeFile(fileContent: string) {
        console.log(fileContent,'fileContent');
        
        fs.writeFileSync(this.filePath, fileContent)

    }
    // 运行项目方法
    async init() {
        const html = await this.getHtml()
        const jsonInfo = this.getJsonInfo(html)
        const fileContent = this.getNewcontent(jsonInfo)
        this.writeFile(JSON.stringify(fileContent))
    }
    constructor() {
        this.init()

    }
}
new Reptitle()
