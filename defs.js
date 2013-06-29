rhymeTable = {}
function onlyAlphaChars(str) 
{ 
	var strStrip = new String(str); 
    strStrip = strStrip.replace(/[^a-zA-Z-']/g, ''); 
    return strStrip; 
}
function noControlChars(str) 
{ 
	var strStrip = new String(str); 
    strStrip = strStrip.replace(/[*@]/g, ''); 
    return strStrip; 
}
function fancyPoemify(str) 
{ 
	str = noControlChars(str);
	str = nl2br(str);
	return str
}

$('#textarea').keypress(function() {

	setTimeout(updateWindows,1);
});


function formatDefs(defs){
	// parse rhymelist
    console.log(defs.defs);
    console.log(defs.defs[1]);
	var formattedRhymeList = ""
	for (r = 0; r<defs.defs.length;r++){
		console.log(defs.defs[r]);
        formattedRhymeList += "<span style='padding: 15px 0 15px 0;'>"  +defs.defs[r][0] +": "+ defs.defs[r][1] + "</span><br>"
	}
	return formattedRhymeList
}

function formatSyns(syns){
	// parse rhymelist
    console.log(syns.syns);
    console.log(syns.syns[1]);
	var formattedRhymeList = ""
	for (r = 0; r<syns.syns.length;r++){
		console.log(syns.syns[r]);
        formattedRhymeList += "<span style='padding: 15px 0 15px 0;'>"  +syns.syns[r] + "</span><br>"
	}
	return formattedRhymeList
}

function retrieveDefs(rhymeWord){
         console.log("DEFF "+ rhymeWord);
		// rhyme on, motherfucker
    var url = 'http://localhost:5000/def/' + rhymeWord;
		$.ajax({
			defWord: rhymeWord,
			url: url,
			success: function(defs) {
				if(typeof(defs)=="string") defs = $.parseJSON(defs);
	
                //alert(this.rhymeWord)
				var formattedRhymeList = formatDefs(defs);
				rhymeTable[this.rhymeWord]=formattedRhymeList;
			    console.log(formattedRhymeList);
				displayRhymeList(this.rhymeDef, formattedRhymeList, "defs")
			}
		});

	
}

function retrieveSyns(rhymeWord){
		// rhyme on, motherfucker
    console.log("SYNN "+ rhymeWord);
    var url = 'http://localhost:5000/syn/' + rhymeWord;
		$.ajax({
			synWord: rhymeWord,
			url: url,
			success: function(syns) {
				if(typeof(syns)=="string") syns = $.parseJSON(syns);
	
                //alert(this.rhymeWord)
				var formattedRhymeList = formatSyns(syns);
				rhymeTable[this.rhymeWord]=formattedRhymeList;
			    console.log(formattedRhymeList);
				displayRhymeList(this.rhymeWord, formattedRhymeList, "syns")
			}
		});

	
}

function parseWords(){

	rhymeWord = ""
	rhymeWords = []
	for (i=lines.length-1;i>=0;i--){
		line = lines[i].trim()
		words = line.split(" ");
		for (w=words.length-1;w>=0;w--){
			word = words[w].trim()
			if(word.length == 0) continue;
			if(word.indexOf("*") !== -1){
				rhymeWord = onlyAlphaChars(word);
				rhymeWords.push(rhymeWord);
				break;
			}
		}
		if(rhymeWords.length>=2) break;
	}
	if (rhymeWords.length> 0){
        console.log(rhymeWords);
        var word = rhymeWords.pop();
        retrieveDefs(word);
        retrieveSyns(word);
    }
}

function updateWindows(){
	text = $('#textarea').text();


	hyp = document.getElementById("bigfancypoem");	
	atTheBottom = ((hyp.scrollTop+hyp.clientHeight) >= hyp.scrollHeight-30);
	//alert(hyp.scrollTop + " " + hyp.clientHeight + " " + (hyp.scrollTop+hyp.clientHeight) + " " + hyp.scrollHeight); 
	if(atTheBottom) hyp.scrollTop = hyp.scrollHeight-hyp.clientHeight;
	
	lines = text.split("\n");
    parseWords(lines);

}

helpers = [["",0],["",0]]
function displayRhymeList(rhymeWord, formattedRhymeList, dest){
	// cache queries
	$('#' + dest).html(fancyPoemify(formattedRhymeList));

//	$('#help'+i).html("<h3>" + rhymeWord + "</h3><div class='rhymeList'>" + formattedRhymeList + "</div>")
}

$("#textarea").keypress(function(event){
    var editable = document.getElementById('textarea');
    var key = String.fromCharCode(event.which);
    var existingText = $(this).text();
    var newText = highlight( existingText, key);
    var editable = document.getElementById('textarea');
    var index = getCaretPosition(editable);    
    if (newText != existingText && key != " "){
        $(this).html(newText);
        var editable = document.getElementById('textarea');
        if (index && editable.childNodes.length > 1){
            setSelectionRange(editable, 0, index);
        }
    }
});
