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
                          $(this).text('');
                          $(this).off('focus');
});
	
function updateWindows(){
	text = $('#textarea').text();

	$('#fancypoem').html(fancyPoemify(text));
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
    var n, o = 0, index = 0;
    sel = window.getSelection();
    if (sel.rangeCount) {
    range = sel.getRangeAt(0);

    while (n = tw.nextNode()) {
        console.log(n);


        if (n === range.endContainer) {
            index += range.endOffset;
            break;
        }
        else{
            index += n.textContent.length;
        }
    }
    return index;
    /*
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);

            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
                console.log("cp "+caretPos);
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;*/
}

var setSelectionRange = function(element, start, end) {
    var rng = document.createRange(),
    sel = getSelection(),
    n, o = 0;
    tw = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);
    console.log(tw);
    while (n = tw.nextNode()) {
        console.log(n);
        o += n.textContent.length;
        if (o > start) {
            rng.setStart(n, n.textContent.length + start - o);
            start = Infinity;
        }
        if (o >= end) {
            rng.setEnd(n, n.textContent.length + end - o);
            break;
        }
    }
    sel.removeAllRanges();
    sel.addRange(rng);
};

var setCaret = function(element, index) {
    setSelectionRange(element, index, index);
};

var firstChar = false;
$("#textarea").keypress(function(event){
    var key = String.fromCharCode(event.which);
    var existingText = $(this).text();
    var newText = highlight( existingText, key);
    var editable = document.getElementById('textarea');
    var index = getCaretPosition(editable);    
    var savedRange;
    /*
    if(window.getSelection && window.getSelection().rangeCount > 0)
    {
        console.log("saving");
        savedRange = window.getSelection().getRangeAt(0).cloneRange();
        savedRange.collapse(false);
    }
    */
    $(this).html(newText);
    setCaret('textarea', index);
    /*
    var sel = window.getSelection();
    sel.removeAllRanges();
    console.log(savedRange);
    sel.addRange(savedRange);
    var el = document.getElementById("textarea");
    var range = document.createRange();
    var sel = window.getSelection();
//    index = Math.min(index, $(el).text().length);
    try{
        range.setStart(el.childNodes[0], 1);
        range.setEnd(el.childNodes[0], index-1);
        //range.collapse(false);
        //sel.removeAllRanges();
        //sel.addRange(range);    

    }
    catch (NotFoundError){
        console.log(el.childNodes[0]);
        console.log(el);
        console.log("why" + index);
    }
    
    
    /*editable = document.getElementById('textarea');
    if ($('#textarea').text().trim().length > 0 ){
        setCaret(editable,index);
    }
    else{
        firstChar = true;
    }
    */
   //           placeCaretAtEnd( document.getElementById("textarea") );
});
