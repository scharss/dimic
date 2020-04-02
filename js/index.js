var config = {
    apiKey: "AIzaSyCv3OQt7LCiAuDCJEiF5Yaw679BTvWiirs",
    authDomain: "domicilios-a2865.firebaseapp.com",
    databaseURL: "https://domicilios-a2865.firebaseio.com",
    projectId: "domicilios-a2865",
    storageBucket: "domicilios-a2865.appspot.com",
    messagingSenderId: "342829914057",
    appId: "1:342829914057:web:272c66cb3fc54c2707ba18",
    measurementId: "G-D8YS2CD0RJ"
};
var db = firebase.initializeApp(config).database();
var { LMap, LTileLayer, LMarker } = Vue2Leaflet;
var userRefs = db.ref('users')
new Vue({
    el: '#app',
    components: { LMap, LTileLayer, LMarker },
    data() {
        return {
            myUuid: localStorage.getItem('myUuid'),
            zoom: 14,
            center: L.latLng(3.5289336, -76.2966477),
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
            marker: L.latLng(3.5289336, -76.2966477),
            watchPositionId: null
        }
    },
    mounted() {
        var vm = this
        if (!vm.myUuid) {
            vm.myUuid = vm.guid();
            localStorage.setItem('myUuid', vm.myUuid);
        } else {

            vm.watchPositionId = navigator.geolocation.watchPosition(vm.successCoords, vm.errorCoords);

        }



    },
    firebase: {
        users: userRefs.limitToLast(100)
    },
    methods: {
        successCoords(position) {
            var vm = this
            if (!position.coords) return

            userRefs.child(vm.myUuid).set({
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                timestamp: Math.floor(Date.now() / 1000)
            })
            vm.center = L.latLng([position.coords.latitude, position.coords.longitude])
            vm.marker = L.latLng([position.coords.latitude, position.coords.longitude])
        },
        errorCoords() {
            console.log('Unable to get current position')
        },
        formatLocation(lat, lng) {
            return L.latLng(lat, lng)
        },
        guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }
});