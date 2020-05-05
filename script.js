$(document).ready(function () {
    var url = 'https://spreadsheets.google.com/feeds/list/1U0WzcCtJTTIuXc7y168oavqbW0i6sDAFqfaZJVmDBHM/od6/public/values?alt=json';

    $.getJSON(url, function (data) {
        console.log(data);
        data = data['feed']['entry'];
        console.log(data);
        showGoods(data);
    });

    function showGoods(data){
        var out = '';
        for(var i=0; i<data.length; i++){
            if(data[i]['gsx$show']['$t']!=0){//  не показывать элементы с show 0
            out +=`<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
            out +=`<div class="goods">`;
            out +=`<h5>${data[i]['gsx$name']['$t']}</h5>`;
            out +=`<img src="${data[i]['gsx$image']['$t']}" alt="apple">`;
            out +=`<p class="cost">цена: ${data[i]['gsx$cost']['$t']}</p>`;
            out +=`</div>`;
            out +=`</div>`;
        }
        }
        $('.shop-field').html(out);
    }
});