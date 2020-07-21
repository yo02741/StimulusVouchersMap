var data;
var _3Kurl = 'https://3000.gov.tw/hpgapi-openmap/api/getPostData';
var list_el = document.querySelector('.list');
var str = ``;

var cityareaurl = 'https://raw.githubusercontent.com/Feitoengineer19/mask-map/master/CityCountyData.json';
var h1_el = document.querySelector('#title');
var city_el = document.querySelector('#city');
var area_el = document.querySelector('#area');
var strr = `<option selected disabled>請選擇縣市</option>`;
var strrr = `<option selected disabled>請選擇</option>`;


// 建立 Leaflet 地圖
var map = L.map('map');

//詢問GPS權限後定位
if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
        map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
      });
  } else {
    alert('抱歉，您的裝置不支援定位功能。');
  }

//定位button
var loca_el = document.querySelector('.location_icon');
loca_el.addEventListener('click',function(){
    if ("geolocation" in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition(function(position) {
            map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
          });
      } else {
        alert('抱歉，您的裝置不支援定位功能。');
      }
})



// 設定圖資來源
var osmUrl='https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png';
var osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 18});
map.addLayer(osm);

//設定定位icon樣式

var Icon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

var markers = new L.MarkerClusterGroup().addTo(map);



//連接振興券api
axios.get(_3Kurl)
    .then(function(response){
        data = response.data;
        data.forEach(item=>{
            markers.addLayer(L.marker([item.latitude,item.longitude], {icon: Icon})
            .bindPopup(`<h3 class="storename">${item.storeNm}</h3>
            <p class="addr">${item.addr}</p>
            <p class="tel">${item.tel}</p>
            <p class="busitime">${item.busiTime}</p>
            <p class="total">三倍券庫存:<span class="num">${item.total}</span></p>`));
        });
        map.addLayer(markers);
    })



//連接縣市鄉鎮api
axios.get(cityareaurl)
.then(function(response){
    response.data.forEach(item=>{
        strr += `<option value ="${item.CityName}">${item.CityName}</option>`
    })
    city_el.innerHTML = strr;
    // console.log(response.data)

    city_el.addEventListener('change',function(){
        area_el.setAttribute('style','display:block')
        // console.log(city_el.value)
        response.data.forEach(ci=>{  
            if(city_el.value === ci.CityName){
                strrr = `<option selected disabled>請選擇</option>`;
                ci.AreaList.forEach(item=>{
                    strrr += `<option value ="${item.AreaName}">${item.AreaName}</option>`;
                })
            }
            area_el.innerHTML = strrr;
        })
    })

    area_el.addEventListener('change',function(){
        setTimeout(function(){
            city_el.setAttribute('style','display:none');
            area_el.setAttribute('style','display:none');
            h1_el.setAttribute('style','display:none');
            list_el.setAttribute('style','display:block');
        },500);
        str = `<li class="back">
                    <a href="#" class="backbtn">
                        back
                    </a>
                </li>`;
        data.forEach(item=>{
            if(city_el.value === item.hsnNm && area_el.value === item.townNm){
                str += `<li class="card" id="${item.storeCd}">
                            <a href="#">
                                <h3 class="storename">${item.storeNm}</h3>
                            </a>
                                <p class="addr">${item.addr}</p>
                                <p class="tel">${item.tel}</p>
                                <p class="busitime">${item.busiTime}</p>
                                <p class="total">三倍券庫存:<span class="num">${item.total}</span></p>
                        </li>`; 
            }
        })
        str += `<li class="back">
                    <a href="#" class="backbtn">
                        back
                    </a>
                </li>`;
        list_el.innerHTML = str;
        var backbtn_el_nodelist = document.querySelectorAll('.backbtn');
        var backbtn_el = Array.apply(null, backbtn_el_nodelist);
        backbtn_el.forEach(item=>{
            item.addEventListener('click',function(){
                console.log('hi')
                city_el.setAttribute('style','display:block');
                area_el.setAttribute('style','display:block');
                h1_el.setAttribute('style','display:block');
                list_el.setAttribute('style','display:none');
            })
        });
    })
})

list.addEventListener('click',function(e){
    if(e.target.tagName == 'H3'){
        data.forEach(item=>{
            if(item.storeNm == e.target.innerText){
                map.setView(new L.LatLng(item.latitude, item.longitude), 15);
            }
        })
    }
})

    // hsnCd(縣市代號)
    // hsnNm(縣市名稱)
    // townCd(鄉鎮區代號)
    // townNm(鄉鎮區名稱)
    // storeCd(分局代號)
    // storeNm(分局名稱)
    // addr(門市地址)
    // zipCd(郵遞區號)
    // tel(電話)
    // busiTime(營業時間)
    // busiMemo(營業備註)
    // longitude(經度)
    // latitude(緯度)
    // total(服務量)
    // updateTime(異動時間)