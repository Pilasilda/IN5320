//Onclick,button
function pushTo(){
  var test = document.getElementById("input");
  initt(test.value);
}

/*Step 3*/
//method for saving and reading data from localstorage
function setToStorage(country){
  if(typeof(Storage) != "undefined"){
    if(window.localStorage.getItem(country) == null){
      window.localStorage.setItem(country, country);
    }
  }else{
    console.log("Do not support webstorage..");
  }
}

//method for removing data from localstorage
function removeFromStorage(input){
  if(typeof(Storage) !== "undefined"){
    if(window.localStorage.getItem(input) != null){
      window.localStorage.removeItem(input);
    }
  }else{
    console.log("Do not support webstorage...");
  }
}

/*Step 1+2+6*/
function initt(country){
  var ul = document.getElementById("list");
  var list = document.createElement("li");

  if(country == ''){
    alert("Please do enter a value in the textfield...");
  }

  if(country != "" && country != null && !get_list().includes(country)){
    $.getJSON("https://d6wn6bmjj722w.population.io/1.0/countries/", function(myJson){
      if(!myJson.countries.includes(country)){
        alert(country + " doesn't exists in this API.");
      }else{
        list.setAttribute('id', country);

        //creating a delete button
        var span = document.createElement("addBtn");
        var t = document.createTextNode(" X ");
        //button color
        span.style.color = 'red';

        span.appendChild(t);
        span.addEventListener("click", function(element){
          ul.removeChild(list);
          //call on remove from storage function
          removeFromStorage(country);
        });
        list.appendChild(document.createTextNode(country));

        $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + country + "/today-and-tomorrow/", function(myJson){
          list.appendChild(document.createTextNode(" - "));
          list.appendChild(document.createTextNode(myJson.total_population[0].population));
          setInterval(function(){
            //var obj = myJson.parseInt(country);
            list.replaceChild(document.createTextNode(replaceOldPop(list.childNodes[3].data, myJson.total_population[1].population)), list.childNodes[3])
          }, 3000);
        });

        list.appendChild(span);
        ul.appendChild(list);
        //call on storage function
        setToStorage(country);
      }
    });
  }
  document.getElementById("input").value = "";
}

/*Step 3*/
function applied_to_all_elements(array, func){
  var arr = [];
  var i;

  for(i = 0; i < array.length; i++){
    arr.push(func(array[i]));
  }

  return arr;
}

/*Step 4A */
function list(element, searchWord){
  return element.startsWith(searchWord);
}

/*Step 4B*/
function list_start(element, searchWord){
  if(list(element,searchWord)){
    return element;
  }
}

/*Step 5*/
function filter_info(liste, searchWord){
  var arr = [];
  //console.log("The word you searched for:" + searchWord);
  var i;

  for(i = 0, length = liste.length; i < length; i++){
    if(list_start(liste.item(i).firstChild.data.toLowerCase(), searchWord.toLowerCase())){
      arr.push(liste.item(i).firstChild.data);
    }
  }
  return arr;
}

function get_list(){
  var list = [];
  var i;
  var elem = document.getElementById("list").getElementsByTagName("li");

  for(i = 0, length = elem.length; i < length; i++){
    list.push(elem.item(i).firstChild.data);
  }

  return list;
}

/*Step 5*/
function integrated_search(){
  applied_to_all_elements(Object.keys(localStorage), initt);
  var search = document.getElementById("search").value;

  if(search != "" && search != null){
    var p = filter_info(document.getElementById("list").getElementsByTagName("li"), search);
    //console.log(p);
    var l = Object.keys(localStorage);
    var list = document.getElementById("list");
    var i;

    for(i = 0; i< l.length; i++){
      if(!p.includes(l[i]) && document.getElementById(l[i]) != null){
        list.removeChild(document.getElementById(l[i]));
      }
    }
  }
}

/*Step 7*/
function get_population_increase(today, tomorrow){
  return (tomorrow - today) / 86400;
}
/*
function updatePopCount(today, tomorrow){
  //var updatedPop.count = 0;
  updatePopCount.counter++;
  return parseInt(today, 10) + get_population_increase(today, tomorrow)* updatePopCount.counter;
}*/

function replaceOldPop(today, tomorrow){
  var countRate = get_population_increase(today, tomorrow);
  if(countRate >= 0){
    return ++today;
  }
  return --today;
}

//Kunne ikke finne ut hvordan man skulle oppdatere populasjon hvert sekund baade nedgaaende og oppgaaende, setinterval metoden printer naa ut [object object], har derfor kommentert den ut.
/* Sources
https://www.w3schools.com/html/html_lists.asp
https://www.w3schools.com/html/html_layout.asp
https://www.w3schools.com/jsref/met_win_setinterval.asp
https://www.w3schools.com/jsref/prop_win_localstorage.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
https://www.w3schools.com/js/js_json_parse.asp?fbclid=IwAR1QVmtI8-n4ROiGY9pHqNMj4vfrPrSXrmbq179g4xwP2sz-NxSjrgZf9uU
*/
