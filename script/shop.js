window.onload = function(){
    let cart ={};
    let goods = {};
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
            console.log(data);// для срвнения с новым массивом goods

            goods = arrayHelper(data);
            console.log(goods);// выводит элементы более удобные для чтения
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
                out +=`<p class="cost"><button  type="button" class="btn btn-success" name = "add-to-cart" data="${data[i]['gsx$id']['$t']}">Купить</button></p>`;
                out +=`</div>`;
                out +=`</div>`;
            }
        }
        return out;
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


//корзина для покупок

document.onclick = function(e){
    // привязываем кнопку к событиям
    console.log(e.target.attributes.data.nodeValue);
    console.log(e.target.attributes.name.nodeValue);
    if(e.target.attributes.name.nodeValue == 'add-to-cart'){
        addToCart(e.target.attributes.data.nodeValue);
    }

}


function addToCart(elem){
    if(cart[elem] !== undefined){// если внутри массива cart есть уже этот элемент, то будет добавлять+1
        cart[elem]++;
    }
    else{
        cart[elem] = 1;// усли нет, то добавляет новый
    }
    console.log(cart);
    showCart();
}

//вспомогательная функция что бы перебрать массив data, информация будет иметь более презентаьельный вид
function arrayHelper(arr){
    let out ={};
    for (let i = 0; i < arr.length; i++){
        let temp = {};
        temp['articul'] = arr[i]['gsx$articul']['$t'];
        temp['name'] = arr[i]['gsx$name']['$t'];
        temp['cost'] = arr[i]['gsx$cost']['$t'];
        temp['image'] = arr[i]['gsx$image']['$t'];
        out[ arr[i]['gsx$id']['$t']] = temp;
    }
    return out;
}

// отрисовываем корзину
function showCart(){
    let ul = document.querySelector('.cart');
    ul.innerHTML = '';
    let sum = 0;
    for (let key in cart){
        let li = '<li>';
        li += goods[key]['name'] + ' ';
        li += cart[key]+ ' шт';
        li += ' ' + goods[key]['cost'] * cart[key] + ' грн.';
        sum += goods[key]['cost'] * cart[key];
        ul.innerHTML += li;
    }
    ul.innerHTML += 'Итого: ' + sum;
}
}