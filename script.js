window.alert("Test aşamasındadır.")
const selectedFile = document.getElementById('avatar');

selectedFile.onchange = function(){
    document.getElementById("ozet").style.display = "block";
    document.getElementById("h1").style.display = "none";
    document.getElementById("li1").style.display = "none";
    document.getElementById("li2").style.display = "inline-block";
    document.getElementById("li3").style.display = "inline-block";
    document.getElementById("li4").style.display = "inline-block";
    
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
        
        
        let tableheadings = []
        let natromus = []
        let hesaplar = ["1003","1004","1005","1006","1007","1008","1009","1012","1013","1014","10000","10003","700000"]
        let butunhesaplar = Object.keys(table)
        let sentetik = ["GAUUSD","GAUTRY","XAUTRY","XAGTRY","EURCNH","CNHTRY","SGDCNH","CNHHKD","XAUTHB","GBPHKD","XAUEUR","TRYRUB","XAUCNH","XAUHKD"]



        //burası headingsleri ve natromus yapıyor
        for (i=0;i<Object.keys(table).length;i++){
            
            if(butunhesaplar[i]>6999&&butunhesaplar[i]<8000){natromus.push(butunhesaplar[i])

            }
            let symbols = Object.keys(table[Object.keys(table)[i]]);
            
            for (b=0;b<symbols.length;b++){
                if(tableheadings.indexOf(symbols[b]) === -1) {
                    tableheadings.push(symbols[b]);
                    

                }
            }
        }

        
        //burası 7000lere sembolleri ekliyor
        for(i=0;i<natromus.length;i++){
            for(b=0;b<tableheadings.length;b++){
                if(table[natromus[i]][tableheadings[b]] === undefined) {table[natromus[i]][tableheadings[b]] = 0} 
            }
        }

        //burası diğer hesaplara sembolleri veya hesapları ekliyor
        for(i=0;i<hesaplar.length;i++){
            if (table[hesaplar[i]] === undefined) {table[hesaplar[i]] = {}}
            for(b=0;b<tableheadings.length;b++){
                if(table[hesaplar[i]][tableheadings[b]] === undefined) {table[hesaplar[i]][tableheadings[b]] = 0} 
            }
        }

        //burası natromustoplam objesi oluşturuyor
        table["natromustoplam"] = {}
        for(b=0;b<tableheadings.length;b++){
            table["natromustoplam"][tableheadings[b]] = 0
            for(a=0;a<natromus.length;a++){
                let toplam = table["natromustoplam"][tableheadings[b]] + table[natromus[a]][tableheadings[b]];
                toplam = Math.round(toplam * 100) / 100
                table["natromustoplam"][tableheadings[b]] = toplam;
            }
        }

        //burası natro net objesi oluşturuyor yani 700000 eksi 1013
        table["natronet"] = {}
        for(b=0;b<tableheadings.length;b++){
            let net = table["700000"][tableheadings[b]] - table["1013"][tableheadings[b]] - table["1014"][tableheadings[b]]
            net = Math.round(net * 100) / 100
            table["natronet"][tableheadings[b]] = net;
        }

        //natro fark objesi oluşturuyor
        table["natrofark"] = {}
        for(b=0;b<tableheadings.length;b++){
            let fark = table["natronet"][tableheadings[b]] - table["natromustoplam"][tableheadings[b]]
            fark = Math.round(fark * 100) / 100
            table["natrofark"][tableheadings[b]] = fark;
        }

        //ftdmustoplam objesi oluşturuyor
        table["ftdmustoplam"] = {}
        for(b=0;b<tableheadings.length;b++){
            let toplam = table["700000"][tableheadings[b]] + table["10000"][tableheadings[b]] + table["10003"][tableheadings[b]]
            toplam = Math.round(toplam * 100) / 100
            table["ftdmustoplam"][tableheadings[b]] = toplam;
        }

        //sentetik objesi oluşturuyor
        table["sentetik"] = {}
        for(b=0;b<tableheadings.length;b++){
            if(sentetik.indexOf(tableheadings[b])<0)
            {
                table["sentetik"][tableheadings[b]] = table["1004"][tableheadings[b]] 
            } else {
                table["sentetik"][tableheadings[b]] = 0
            }
        }
        //ftd net objesi oluşturuyor
        table["ftdnet"] = {}
        for(b=0;b<tableheadings.length;b++){
            let net = table["1006"][tableheadings[b]] + table["1007"][tableheadings[b]] + table["1008"][tableheadings[b]] + table["1009"][tableheadings[b]] + table["1012"][tableheadings[b]] - table["1004"][tableheadings[b]] + table["1005"][tableheadings[b]] - table["1003"][tableheadings[b]]
            net = Math.round(net * 100) / 100
            table["ftdnet"][tableheadings[b]] = net;
        }



        //ftd fark objesi oluşturuyor
        table["ftdfark"] = {}
        for(b=0;b<tableheadings.length;b++){
            let fark = table["ftdnet"][tableheadings[b]] - table["ftdmustoplam"][tableheadings[b]]
            fark = Math.round(fark * 100) / 100
            table["ftdfark"][tableheadings[b]] = fark;
        }

        //ozet objesi oluşturuyor

        console.log(table)

        
        //ilk tablo yeni
        for(i=0;i<3;i++){
            
            if(i===0){//7000müs heading kısmı
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow").appendChild(th)
                }
                document.getElementById("7000table").appendChild(tablerow)
            }

            if(i===1){//müşteri kısmı
                for(a=0;a<natromus.length;a++){
                    let tablerow = document.createElement("tr");
                    let td1 = document.createElement("td")
                    td1.innerHTML = natromus[a];
                    tablerow.appendChild(td1);
                    for(b=0;b<tableheadings.length;b++){
                        let td = document.createElement("td");
                        td.innerHTML = table[natromus[a]][tableheadings[b]]
                        tablerow.appendChild(td)
                    }
                    document.getElementById("7000table").appendChild(tablerow)
                }
            }

            if(i===2){//burası ilk  tablo genel toplam yani natromustoplam
                let tablerow = document.createElement("tr");
                let th1 = document.createElement("th")
                th1.innerHTML = "Genel Toplam";
                tablerow.appendChild(th1);
                
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["natromustoplam"][tableheadings[b]];
                    tablerow.appendChild(th);
                }

                document.getElementById("7000table").appendChild(tablerow);
            }
            
        }



        //burası ikinci tablo
        for (i=0;i<5;i++){
            if(i===0){ //burası ikinci tablo headingler
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow2").appendChild(th)
                }
                document.getElementById("natrotable").appendChild(tablerow)
            }
            if(i===1){//ikinci tablo 700000 hesap
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "700000"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["700000"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("natrotable").appendChild(tablerow);   
            }
            if(i===2){//ikinci tablo 1013 book hesap
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "1013 BOOK"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1013"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("natrotable").appendChild(tablerow);   
            }
            if(i===3){//ikinci tablo copy trade
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "1014 C.T."
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1014"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("natrotable").appendChild(tablerow);   
            }
            if(i===4){ //ikinci tanblo natro net yani son row
                let tablerow = document.createElement("tr");
                let th1 = document.createElement("th")
                th1.innerHTML = "Natro Net"
                tablerow.appendChild(th1);
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["natronet"][tableheadings[b]]
                    tablerow.appendChild(th)
                    }
                document.getElementById("natrotable").appendChild(tablerow);   
            }
        }
        

        
        
        for(i=0;i<2;i++){//burası natro fark
            if(i===0){ 
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow3").appendChild(th)
                }
                document.getElementById("natrofark").appendChild(tablerow)
            }
            if(i===1){//üçüncü tablo 2. satır
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = " "
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["natrofark"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("natrofark").appendChild(tablerow);   
            }
        }

















        //burada ftd müş yapıyor
        for(i=0;i<5;i++){
            if(i===0){ 
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow4").appendChild(th)
                }
                document.getElementById("ftdmus").appendChild(tablerow)
            }
            if(i===1){//ikinci tablo 700000 hesap
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "700000"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["700000"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdmus").appendChild(tablerow);   
            }
            if(i===2){//ikinci tablo 10000 hesap
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "10000"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["10000"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdmus").appendChild(tablerow);   
            }
            if(i===3){//ikinci tablo 10000 hesap
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "10003"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["10003"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdmus").appendChild(tablerow);   
            }
            if(i===4){ //ikinci tablo natro net yani son row
                let tablerow = document.createElement("tr");
                let th1 = document.createElement("th")
                th1.innerHTML = "Genel Toplam"
                tablerow.appendChild(th1);
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["ftdmustoplam"][tableheadings[b]]
                    tablerow.appendChild(th)
                    }
                document.getElementById("ftdmus").appendChild(tablerow);   
            }

        }


        //ftd ikinci tabloyu oluşturuyor
        for (i=0;i<11;i++){
            if(i===0){ 
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow5").appendChild(th)
                }
                document.getElementById("ftdtable").appendChild(tablerow)
            }

            if(i===2){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "CFH"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1006"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===3){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "IS PRIME"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1007"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===4){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "IS SWAP"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1008"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===5){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "SUCDEN"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1009"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===6){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "SAXO"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1012"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===7){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "1003 BOOK"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1003"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===8){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "SYNTHETIC"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1004"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===9){
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = "RESIDUAL"
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["1005"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }

            if(i===10){
                let tablerow = document.createElement("tr");
                let th1 = document.createElement("th")
                th1.innerHTML = "FTD Net"
                tablerow.appendChild(th1);
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["ftdnet"][tableheadings[b]]
                    tablerow.appendChild(th)
                    }
                document.getElementById("ftdtable").appendChild(tablerow);   
            }



            
            

        }



        //ftd 3. tablo yani ftd fark oluşturuyor
        for(i=0;i<2;i++){
            if(i===0){ 
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    let th = document.createElement("th")
                    th.innerHTML = tableheadings[b];
                    document.getElementById("firstrow6").appendChild(th)
                }
                document.getElementById("ftdfark").appendChild(tablerow)
            }

            if(i===1){//üçüncü tablo 2. satır
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("td")
                td1.innerHTML = " "
                tablerow.appendChild(td1);
                for(b=0;b<tableheadings.length;b++){
                    let td = document.createElement("td");
                    td.innerHTML = table["ftdfark"][tableheadings[b]]
                    tablerow.appendChild(td)
                    }
                document.getElementById("ftdfark").appendChild(tablerow);   
            }
        }

        let ozetheadings = []
        for(i=0;i<3;i++){
            
            if(i===0){//özet heading kısmı
                let tablerow = document.createElement("tr");
                for(b=0;b<tableheadings.length;b++){
                    
                    if(table["natrofark"][tableheadings[b]] != 0||table["ftdfark"][tableheadings[b]] != 0){
                        ozetheadings.push(tableheadings[b])
                        let th = document.createElement("th")
                        th.innerHTML = tableheadings[b];
                        document.getElementById("firstrow7").appendChild(th)}

                }
                document.getElementById("ozettablo").appendChild(tablerow)
                
            }

            if(i===1){//özet tablo 2. satır
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("th")
                td1.innerHTML = "FTD Fark"
                tablerow.appendChild(td1);
                for(b=0;b<ozetheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["ftdfark"][ozetheadings[b]]
                    tablerow.appendChild(th)
                    }
                document.getElementById("ozettablo").appendChild(tablerow);   
            }

            if(i===2){//özet tablo 3. satır
                let tablerow = document.createElement("tr");
                let td1 = document.createElement("th")
                td1.innerHTML = "Natro Fark"
                tablerow.appendChild(td1);
                for(b=0;b<ozetheadings.length;b++){
                    let th = document.createElement("th");
                    th.innerHTML = table["natrofark"][ozetheadings[b]]
                    tablerow.appendChild(th)
                    }
                document.getElementById("ozettablo").appendChild(tablerow);   
            }

        }














        



    };
    reader.readAsText(selectedFile.files[0]);
    
    
}

function ftdButton() {
    document.getElementById("natrotables").style.display = "none";
    document.getElementById("ozet").style.display = "none";
    document.getElementById("ftdtables").style.display = "block";
    document.getElementById("ftdfark").scrollIntoView({behavior:"smooth",block:"center"});
}

function natroButton() {
    document.getElementById("ftdtables").style.display = "none";
    document.getElementById("ozet").style.display = "none";
    document.getElementById("natrotables").style.display = "block";
    document.getElementById("natrofark").scrollIntoView({behavior:"smooth",block:"center"})
}

function ozetButton() {
    document.getElementById("ftdtables").style.display = "none";
    document.getElementById("natrotables").style.display = "none";
    document.getElementById("ozet").style.display = "block";
    document.getElementById("ozet").scrollIntoView({behavior:"smooth",block:"center"})
}