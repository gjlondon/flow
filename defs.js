
function formatDefs(defs){
	// parse rhymelist
	var formattedRhymeList = ""
	for (r = 0; r<defs.defs.length;r++){
        formattedRhymeList += "<span style='padding: 15px 0 15px 0;'>"  +defs.defs[r][0] +": "+ defs.defs[r][1] + "</span><br>"
	}
	return formattedRhymeList
}

function formatSyns(syns){
	// parse rhymelist
	var formattedRhymeList = ""
	for (r = 0; r<syns.syns.length;r++){
        formattedRhymeList += "<span style='padding: 15px 0 15px 0;'>"  +syns.syns[r] + "</span><br>"
	}
	return formattedRhymeList
}

function retrieveDefs(rhymeWord){
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
				displayDefsList(this.rhymeDef, formattedRhymeList, "defs")
			}
		});
}

function retrieveSyns(rhymeWord){
		// rhyme on, motherfucker
    var url = 'http://localhost:5000/syn/' + rhymeWord;
		$.ajax({
			synWord: rhymeWord,
			url: url,
			success: function(syns) {
				if(typeof(syns)=="string") syns = $.parseJSON(syns);
                //alert(this.rhymeWord)
				var formattedRhymeList = formatSyns(syns);
				rhymeTable[this.rhymeWord]=formattedRhymeList;
				displayDefsList(this.rhymeWord, formattedRhymeList, "syns")
			}
		});	
}

function parseWords(){

	var rhymeWord = ""
	var rhymeWords = []
	for (i=lines.length-1;i>=0;i--){
		var line = lines[i].trim()
		var words = line.split(" ");
		for (w=words.length-1;w>=0;w--){
			var word = words[w].trim()
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
        var word = rhymeWords.pop();
        retrieveDefs(word);
        retrieveSyns(word);
    }
}

function updateDefsWindows(){
	var text = $('#textarea').text();
	var lines = text.split("\n");
    parseWords(lines);
    console.log("gggs " + lines);
}

function displayDefsList(rhymeWord, formattedRhymeList, dest){
	// cache queries
	$('#' + dest).html(fancyPoemify(formattedRhymeList));

//	$('#help'+i).html("<h3>" + rhymeWord + "</h3><div class='rhymeList'>" + formattedRhymeList + "</div>")
}

