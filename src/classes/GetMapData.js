import $ from "jquery";

class GetMapData {

    receive(url, call){

        $.ajax(process.env.VUE_APP_API_URL + url, {
            dataType: 'json',
            method: 'GET',
            mode: "no-cors",
        }).done(function (data) {
            call(data)
        }).fail(function (data) {
            console.log('Oшибка получения данных: ' + data);
        });

    }

}

export default GetMapData