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
}).focus(function(){
                          $(this).text(' ');
                          $(this).off('focus');
});
	
function updateWindows(){
	text = $('#textarea').text();

//	$('#fancypoem').html(fancyPoemify(text));
	hyp = document.getElementById("bigfancypoem");	
	atTheBottom = ((hyp.scrollTop+hyp.clientHeight) >= hyp.scrollHeight-30);
	//alert(hyp.scrollTop + " " + hyp.clientHeight + " " + (hyp.scrollTop+hyp.clientHeight) + " " + hyp.scrollHeight); 
	if(atTheBottom) hyp.scrollTop = hyp.scrollHeight-hyp.clientHeight;
	
	lines = text.split("\n");
	
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
	
	if(rhymeWords.length>0){
		//$('#textarea').val($('#textarea').val().replace('R','*'))
	}
	
	for (rhymeWord in rhymeWords){
		rhymeWord = rhymeWords[rhymeWord]
		if(rhymeTable[rhymeWord]){
			displayRhymeList(rhymeWord, rhymeTable[rhymeWord]);
		}else{
			// rhyme on, motherfucker
			$.ajax({
			  rhymeWord: rhymeWord,
			  url: 'http://rhymebrain.com/talk?function=getRhymes&word=' + rhymeWord,
			  success: function(rhymes) {
				if(typeof(rhymes)=="string") rhymes = $.parseJSON(rhymes)
				//alert(this.rhymeWord)
				formatterRhymeList = formatRhymes(rhymes)
				rhymeTable[this.rhymeWord]=formattedRhymeList
				displayRhymeList(this.rhymeWord, formattedRhymeList)
			  }
			});
		}
		
	}
	
}

function formatRhymes(rhymes){
	// parse rhymelist
	formattedRhymeList = ""
	for(r=0;r<rhymes.length;r++){
		formattedRhymeList += "<span>" + rhymes[r].word + "</span>"
	}
	return formattedRhymeList
}
helpers = [["",0],["",0]]
function displayRhymeList(rhymeWord, formattedRhymeList){
	// cache queries
	if(helpers[0][0] == rhymeWord || helpers[1][0] == rhymeWord){
		return;
	}
	var d = new Date(); 
	var now = d.getTime() 
	if(helpers[0][1] > helpers[1][1]){
		i = 1;
	}else{
		i = 0;
	}
	helpers[i][1] = now;
	helpers[i][0] = rhymeWord;
	
	$('#help'+i).html("<h3>" + rhymeWord + "</h3><div class='rhymeList'>" + formattedRhymeList + "</div>")
}
function nl2br(text){
	return text.replace(/\n/g,"<br>");
}


function preg_quote( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}


function highlight( data, search )
{
    var newData = data.replace( new RegExp( "(" + preg_quote( search ) + ")" , 'gi' ), "<b style='background-color:yellow;'>$1</b>" );
    return newData;
}


function getCaretPosition(editableDiv) {
    var caretPos = 0, containerEl = null, sel, range;
    tw = document.createTreeWalker(editableDiv, NodeFilter.SHOW_TEXT, null, null);
    var n, o = 0;
    var index = 0;
    var sel = window.getSelection();
    if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        e = range.endContainer;
        if (e != editableDiv){
            while (n = tw.nextNode()) {
                if (n === range.endContainer) {
                    index += range.endOffset;
                    break;
                }
                else{
                    index += n.textContent.length;
                }
            }
            return index;
        }
    }
}

var setSelectionRange = function(element, start, end) {
    var rng = document.createRange(),
    sel = getSelection(),
    n, o = 0;
    tw = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);
    var started = false;
    var i = 0;
    while (n = tw.nextNode()) {
        
        o += n.textContent.length;
        if (!started) {
            rng.setStart(n, 0);
            started = true;
        }
        if (o >= end) {
            /*
            if (editable.childNodes[i].tagName == "B"){
                var text = document.createElement("span");
                var text2 = document.createTextNode(" ");
                text.appendChild(text2);
          
                n.parentNode.insertBefore(text, n.nextSibling);
                rng.setEnd(text, 0);
            }
            else{*/
                rng.setEnd(n, n.textContent.length + end - o);
            //}

            break;
        }
        i += 1;
    }
    sel.removeAllRanges();
    rng.collapse(false);
    sel.addRange(rng);
};

function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    // The temporary <div/> is to perform HTML entity encoding reliably.
    //
    // document.createElement() is *much* faster than jQuery('<div/>')
    // http://stackoverflow.com/questions/268490/
    //
    // You don't need jQuery but then you need to struggle with browser
    // differences in innerText/textContent yourself
    var tmpDiv = jQuery(document.createElement('div'));
    for (var i = 0 ; i < lines.length ; i++) {
        htmls.push(tmpDiv.text(lines[i]).html());
    }
    return htmls.join("<br>");
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
