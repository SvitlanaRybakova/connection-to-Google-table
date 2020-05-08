window.onload = function(){
    let cart ={};
    let goods = {};

    // делаем загрузку корзины из localStorage
    
    function loadCartFromStorage(){
        // если localStorage пуст в нем храниться null, потом в него нельзя засунуть массив
    //поэтому нужна проверка
        if ( localStorage.getItem('cart') != undefined){
            cart = JSON.parse( localStorage.getItem('cart'));// т.к в storage хранится строка, преобразовываем ее в массив
        }
        
    }
    loadCartFromStorage();

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
            showCart();
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
    // привязываем кнопку купить к событиям
    console.log(e.target.attributes.data.nodeValue);
    console.log(e.target.attributes.name.nodeValue);
    if(e.target.attributes.name.nodeValue == 'add-to-cart'){
        addToCart(e.target.attributes.data.nodeValue);
    }
    else if(e.target.attributes.name.nodeValue == 'delete-goods'){// привязываем кнопку удалить к событиям
        // удаление товара из массива cart, аотом нужно удалить из корзины
        delete cart[e.target.attributes.data.nodeValue];
        showCart();// перерисовываем корзину
        localStorage.setItem('cart', JSON.stringify(cart));// перезаписываю состояние Storage после удаления
        console.log(cart);
    }
    else if(e.target.attributes.name.nodeValue == 'plus-goods'){// привязываем кнопку + к событиям
        //увеличиваем количество товара на 1
        cart[e.target.attributes.data.nodeValue]++;
        showCart();// перерисовываем корзину
        localStorage.setItem('cart', JSON.stringify(cart));// перезаписываю состояние Storage после удаления
        console.log(cart);
    }
    else if(e.target.attributes.name.nodeValue == 'minus-goods'){// привязываем кнопку - к событиям
        //проверка, что бы не уйти в отрицательные числа
        if (cart[e.target.attributes.data.nodeValue] - 1 == 0){
            delete cart[e.target.attributes.data.nodeValue];
        }
        else{
            cart[e.target.attributes.data.nodeValue]--;
        }
        
        showCart();// перерисовываем корзину
        localStorage.setItem('cart', JSON.stringify(cart));// перезаписываю состояние Storage после удаления
        console.log(cart);
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
    
    // сохраняем содержимое таблицы в localStorage, но хранить можно только строку
    localStorage.setItem('cart', JSON.stringify(cart));//JSON.stringify переводит массив cart в строку
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
        li += cart[key]+ ' шт ';
        li += ` <button name="plus-goods" data="${key}">+</button>`;
        li += ` <button name="minus-goods" data="${key}">-</button>`;
        li +=  goods[key]['cost'] * cart[key] + ' грн.';
        li += ` <button name="delete-goods" data="${key}">удалить</button>`;
        li += '</li>';
        sum += goods[key]['cost'] * cart[key];
        ul.innerHTML += li;
    }
    ul.innerHTML += 'Итого: ' + sum + ' грн.';
}
}