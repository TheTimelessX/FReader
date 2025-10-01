import { Fragrant } from "fragrant";
import * as fs from "fs";

const pfs = fs.promises;
let fragrant = new Fragrant({
    sensitivity: "high",
    usage: "USAGE: -h / --help\n\n-r PATH / --read PATH\n-a / --async"
})

fragrant.add("call", [{ flag: "--help", kind: "optional" }, { flag: "-h", kind: "optional" }]);
fragrant.add("call", [{ flag: "-a", kind: "optional", help: "read file asyncly" }, { flag: "--async", kind: 'optional', help: "read file asyncly" }])
fragrant.add("middle", [ { flag: "--read", kind: "literal", help: "-r / --read : for reading a file" }, { flag: "-r", kind: "literal", help: "-r / --read : for reading a file" }]);

let isAsync = false;

fragrant.on("find", async (args) => {
    if (args.flag == "--help" || args.flag == "-h"){
        console.log(`USAGE: -h / --help\n\n-r PATH / --read PATH\n-a / --async`);
        process.exit(0);
    } else if (args.flag == "-a" || args.flag == "--async"){
        isAsync = true;
    } else if (args.flag == "-r" || args.flag == "--read"){
        let path = args.value;
        if (path == undefined){
            return console.log(`no file inputted`);
        }

        if (typeof path == "boolean"){
            return;
        }

        if (!fs.existsSync(path)){
            return console.log(`path does not exist: ${path}`);
        }

        let pathStat = fs.statSync(path);

        if (!pathStat.isFile()){
            return console.log(`path is not a file: ${path}`);
        }

        if (isAsync){
            await pfs.readFile(path).then(async (content) => {
                return console.log(content.toString());
            })
        } else {
            let content = fs.readFileSync(path).toString();
            return console.log(content);
        }
    }
})

fragrant.parse();
