$(function () {
    var map = L.map('map').setView([53.5, -1.5], 6);
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/librarieshacked.jefmk67b/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var markers = [];
    var markerGroup = null;
    var refreshData = function () {
        map.removeLayer(markers);
        markers = [];
        Tabletop.init({
            key: '1FHNh42TSwPM8rx4MzOlhsFIVo9oGc_fKojqx84ruaMY',
            callback: function (data, tabletop) {
                $.each(data, function () {
                    var popup = '<h4>' + this.Postcode + '</h4><small>' + this.Description + '</small><br/><small>' + this.District + '</small>';
                    markers.push(L.marker([this.Latitude, this.Longitude]).bindPopup(popup));
                });
                markerGroup = L.featureGroup(markers);
                map.addLayer(markerGroup);
            },
            simpleSheet: true
        });
    };
    refreshData();
    $('#btnSubmit').on('click', function () {
        var postcode = $('#txtPostcode').val();
        var re = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
        var OK = re.exec(postcode);
        if (OK) {
            var data = null;
            $.ajax({
                method: 'GET',
                async: false,
                url: 'https://api.postcodes.io/postcodes/' + postcode,
                success: function(response){
                    data = response;
                }
            });
            window.open('https://docs.google.com/forms/d/1ILPeapyacrJrkSDLS-7aMVHxhM0KaN8w7HT_seLhuPA/viewform?entry.281821379='
                    + postcode + '&entry.2098719225='
                    + (data.result.latitude ? data.result.latitude : '')
                    + '&entry.1579191990='
                    + (data.result.longitude ? data.result.longitude : '')
                    + '&entry.1766495779='
                    + (data.result.admin_county ? data.result.admin_county : '')
                    + '&entry.364061232='
                    + (data.result.admin_district ? data.result.admin_district : '')
                    + '&entry.2047396048='
                    + (data.result.admin_ward ? data.result.admin_ward : '')
                    + '&entry.271850123=');
            $('#txtPostcode').val('');
        } else {
            alert('Invalid postcode');
        }
    });
});