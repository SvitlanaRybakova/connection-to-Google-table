window.onload = function(){
    // прдготовка к отправке запроса
    let getJSON = function(url, callback){
        // создаю новый объект
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';// какой тип ответа жду 
        xhr.onload = function (){//когда он прийдет, проверяю его на тип
             let status = xhr.status;
             if (status == 200) {
                 callback(null, xhr.response);
            }
            else{
                callback(status, xhr.response);
            }
        };
        xhr.send();// отправить запрос
    }

    getJSON('https://spreadsheets.google.com/feeds/list/1U0WzcCtJTTIuXc7y168oavqbW0i6sDAFqfaZJVmDBHM/od6/public/values?alt=json', function(err, data){
        console.log(data); 
        if (err !== null){
            alert ('Error' + err); 
        }
        else{
            data = data['feed']['entry'];
            console.log(data);
            document.querySelector('.shop-field').innerHTML = showGoods(data);
        }      
    });

    function showGoods(data){
            let out = '';
        for(var i=0; i<data.length; i++){
            if(data[i]['gsx$show']['$t']!=0){//  не показывать элементы с show 0
                out +=`<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
                out +=`<div class="goods">`;
                out +=`<h5>${data[i]['gsx$name']['$t']}</h5>`;
                out +=`<img src="${data[i]['gsx$image']['$t']}" alt="apple">`;
                out +=`<p class="cost">Цена: ${data[i]['gsx$cost']['$t']}</p>`;
                out +=`<p class="cost"><button  type="button" class="btn btn-success">Купить</button></p>`;
                out +=`</div>`;
                out +=`</div>`;
            }
        }
        return out;
    }
    
}

// то же самое но на qjuery

// $(document).ready(function () {
//     var url = 'https://spreadsheets.google.com/feeds/list/1U0WzcCtJTTIuXc7y168oavqbW0i6sDAFqfaZJVmDBHM/od6/public/values?alt=json';

//     $.getJSON(url, function (data) {
//         console.log(data);
//         data = data['feed']['entry'];
//         console.log(data);
//         showGoods(data);
//     });

//     function showGoods(data){
//         var out = '';
//         for(var i=0; i<data.length; i++){
//             if(data[i]['gsx$show']['$t']!=0){//  не показывать элементы с show 0
//             out +=`<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
//             out +=`<div class="goods">`;
//             out +=`<h5>${data[i]['gsx$name']['$t']}</h5>`;
//             out +=`<img src="${data[i]['gsx$image']['$t']}" alt="apple">`;
//             out +=`<p class="cost">цена: ${data[i]['gsx$cost']['$t']}</p>`;
//             out +=`</div>`;
//             out +=`</div>`;
//         }
//         }
//         $('.shop-field').html(out);
//     }
// });