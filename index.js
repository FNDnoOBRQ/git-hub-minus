const {mkdir, readFile, writeFile, stat, readdir, unlink} = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(express.json());
const port = 3000;
let fileJson = {};


//loading a page(index.html)
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
});

app.delete('/deleteFile', async (req, res)=>{
    const element = req.body;
    
    const virtualJSON = JSON.parse(await readFile("./file.json", 'utf8'));
    await unlink(path.join("zadania", element['category'], element['fileName']));
    delete virtualJSON[`${element['category']}`][`${element['fileName']}`];

    await writeFile("file.json", JSON.stringify(virtualJSON, null, 2));
    console.log(path.join("zadania", element['category'], element['fileName']) + " removed successfully :)");

    res.json({status: "ok"});

});


app.patch('/updateFile', async (req, res) => {
    const element = req.body;
    const textJson = JSON.parse(await readFile("./file.json", 'utf8'));
    console.log(`String: ${textJson[element['category']][element['fileName']]} was successfully converted to String: ${element['text']}  :)`);
    
    textJson[element['category']][element['fileName']] = element['text'];
    await writeFile("file.json", JSON.stringify(textJson, null, 2));
    res.json({status: "ok"});
});





app.post('/', async (req, res)=>{
    const folderName = req.body.folderName;
    const fileName = req.body.fileName;
    const text = req.body.text;


    //creating folders
        try{
            //making a folder with file's text and file inside it  
            await mkdir(`./zadania/${folderName}`, {recursive: true});
            await writeFile(`./zadania/${folderName}/${fileName}.txt`, text);


            const folders = await readdir("./zadania");

            //for loop for folders
            for (const folder of folders) {
                const folderPath = `./zadania/${folder}`;
                const stats = await stat(folderPath);

                if (stats.isDirectory()) {

                    const files = await readdir(folderPath);
                    fileJson[folder] = {};

                    //for loop for files
                    for(const element of files){
                        const filePath = `${folderPath}/${element}`;

                        if(element.endsWith('.txt')){
                            const content = await readFile(filePath, 'utf8');
                            fileJson[folder][element] = content;
                        }
                    }

                }
            }
            await writeFile("file.json", JSON.stringify(fileJson, null, 2));
            console.log("Page modification complete successfully :)");

            res.json({success: true});

        }
        catch(error){
            console.log(error);
             res.status(500).json({ error: error.message });
        }  

});


//creating a port(localhost:"PORT");
app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
})
