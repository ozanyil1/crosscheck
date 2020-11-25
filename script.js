const selectedFile = document.getElementById('avatar');

selectedFile.onchange = function(){
    const reader = new FileReader();
    reader.onload = function(){ 
        const lines = reader.result.split("\n");
        lines.pop();
        lines.shift();
        lines.shift();
        
        let table = {}

        for(i=0;i<lines.length;i++){
            let lineelement = lines[0];
            lineelement = lineelement.split(";")
            lineelement.splice(1,1);
            lineelement.splice(2,1);
            lineelement.splice(4,5);

            if (lineelement[1].charAt(lineelement[1].length-1) === "."){
                let symbol =  lineelement[1].slice(0,-1)
                lineelement.splice(1,1)
                lineelement.push(symbol)
            } else {
                let symbol = lineelement[1]
                lineelement.splice(1,1)
                lineelement.push(symbol)
            }

            if(lineelement[1] === "sell"){
                let volume = lineelement[2] * -1
                lineelement.splice(2,1,volume)
            } else {
                let volume = lineelement[2] * 1
                lineelement.splice(2,1,volume)
            }
            lineelement.splice(1,1);
            
            if (table[lineelement[0]] === undefined) {table[lineelement[0]] = {}}
            if (table[lineelement[0]][lineelement[2]] === undefined) 
                {table[lineelement[0]][lineelement[2]] = 0;
                table[lineelement[0]][lineelement[2]] = table[lineelement[0]][lineelement[2]] + lineelement[1]
                table[lineelement[0]][lineelement[2]] = Math.round(table[lineelement[0]][lineelement[2]] * 100) / 100
                } 
            else {
                table[lineelement[0]][lineelement[2]] = table[lineelement[0]][lineelement[2]] + lineelement[1]
                table[lineelement[0]][lineelement[2]] = Math.round(table[lineelement[0]][lineelement[2]] * 100) / 100
            }   
            
            
            lines.shift();
            lines.push(lineelement);
        }
        
        //console.log(Object.keys(table))
        let tableheadings = []
        let tablerows = Object.keys(table)
        
        //burası headingsleri yapıyor
        for (i=0;i<Object.keys(table).length;i++){
            

            let symbols = Object.keys(table[Object.keys(table)[i]]);
            
            for (b=0;b<symbols.length;b++){
                if(tableheadings.indexOf(symbols[b]) === -1) {
                    tableheadings.push(symbols[b]);
                    let newheading = document.createElement("th");
                    newheading.innerHTML = symbols[b]
                    document.getElementById("firstrow").appendChild(newheading)

                }
            }
        }

        //burası değerleri dolduruyor
        for (i=0;i<Object.keys(table).length;i++){
            if (Object.keys(table)[i]>=7000&&Object.keys(table)[i]<8000)
            {let tablerow = document.createElement("tr")
            let td1 = document.createElement("td")
            td1.innerHTML =  Object.keys(table)[i]
            tablerow.appendChild(td1);

            for (b=0;b<tableheadings.length;b++){
            if(table[Object.keys(table)[i]][tableheadings[b]] === undefined){
                let td = document.createElement("td");
                td.innerHTML = ""
                tablerow.appendChild(td)
            } else {
                let td = document.createElement("td");
                td.innerHTML = table[Object.keys(table)[i]][tableheadings[b]];
                tablerow.appendChild(td)
            }}

            document.getElementById("7000table").appendChild(tablerow);}
        }
        console.log(table)
        //burası genel toplam çıkartıyor

        let lastrow = document.createElement("tr")
        for (i=-1;i<tableheadings.length;i++){
            
            let td = document.createElement("td")
            let currencytotal = 0
            if (i===-1){
                td.innerHTML = "Genel Toplam"
                table["7000toplam"] = {}}
                 
            else {
                for(b=0;b<Object.keys(table).length;b++){
                    if (Object.keys(table)[b]>=7000&&Object.keys(table)[b]<8000){
                            //console.log(table[Object.keys(table)[b]][tableheadings[i]])
                            
                        if(table[Object.keys(table)[b]][tableheadings[i]] !== undefined) {
                            currencytotal = table[Object.keys(table)[b]][tableheadings[i]] + currencytotal
                            currencytotal = Math.round(currencytotal * 100)/100
                            table["7000toplam"][tableheadings[i]] = currencytotal
                            }
                        }
                    }
                    td.innerHTML = currencytotal
                    td.style.fontWeight = "bold"
                }
            console.log(table["7000toplam"])
            lastrow.appendChild(td);
            
        }
        document.getElementById("7000table").appendChild(lastrow);

        //burası natrotablonun paritelerini yazıyor
        for (i=0;i<tableheadings.length;i++){
            let newheading = document.createElement("th");
            newheading.innerHTML = tableheadings[i];
            document.getElementById("firstrow2").appendChild(newheading)
        }
        
        
        //burası natro tablonun kalan 3 rowunu yapıyor
        for (b=0;b<3;b++){
            let tablerow = document.createElement("tr")
            let td1 = document.createElement("td")
                if(b===0){td1.innerHTML =  "700000"} else if(b===1){td1.innerHTML =  "1013"} else if(b===2){td1.innerHTML =  "Natro Net"}
                tablerow.appendChild(td1);
            for (i=0;i<tableheadings.length;i++){
                
                let td = document.createElement("td")
                if(b===0){
                    
                    if (table["700000"][tableheadings[i]] === undefined) {td.innerHTML = ""} else {
                    td.innerHTML =  table[700000][tableheadings[i]]}
                } 
                else if(b===1){
                    if(table["1013"] != undefined){
                        if (table["1013"][tableheadings[i]] === undefined) {td.innerHTML = ""} else {
                        td.innerHTML =  table["1013"][tableheadings[i]]}}
                } 
                else if(b===2){
                    let currencynet = 0;
                    table["natronet"] = {}
                    if(table["1013"] != undefined){
                    if(table["1013"][tableheadings[i]] === undefined&&table["700000"][tableheadings[i]] === undefined) 
                        {td.innerHTML = 0;
                         currencynet = 0;
                        }
                    else if(table["1013"][tableheadings[i]] === undefined&&table["700000"][tableheadings[i]] != undefined){
                        td.innerHTML = table["700000"][tableheadings[i]]
                        currencynet = table["700000"][tableheadings[i]]}
                    else if(table["1013"][tableheadings[i]] != undefined&&table["700000"][tableheadings[i]] === undefined){console.log("sadece 700bin undefined")}
                    else if (table["1013"][tableheadings[i]] != undefined&&table["700000"][tableheadings[i]] != undefined){console.log("ikisi de defined")}

                    } else {
                        if (table["700000"][tableheadings[i]] === undefined) {td.innerHTML = ""} else {
                            td.innerHTML =  table[700000][tableheadings[i]];
                            currencynet =  table[700000][tableheadings[i]]}
                    }
                }
                tablerow.appendChild(td);
            }
            document.getElementById("natrotable").appendChild(tablerow);
        }


    };
    reader.readAsText(selectedFile.files[0]);
    
    
}
